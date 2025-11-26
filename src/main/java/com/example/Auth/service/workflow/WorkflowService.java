package com.example.Auth.service.workflow;

import com.example.Auth.dto.Dashboard.CompletedDocumentDto;
import com.example.Auth.dto.Workflow.WorkflowHistoriqueDTO;
import com.example.Auth.model.Document.Document;
import com.example.Auth.event.NotificationEvent;
import com.example.Auth.model.User.User;
import com.example.Auth.model.workflow.Workflow;
import com.example.Auth.model.workflow.WorkflowHistorique;
import com.example.Auth.model.User.ServiceDfcr;
import com.example.Auth.repository.Document.DocumentRepository;
import com.example.Auth.repository.workflow.WorkflowRepository;
import com.example.Auth.repository.workflow.WorkflowHistoriqueRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WorkflowService {

        @Autowired
        private WorkflowRepository workflowRepository;

        @Autowired
        private WorkflowHistoriqueRepository workflowHistoriqueRepository;

        @Autowired
        private DocumentRepository documentRepository;

        @Autowired
        private ApplicationEventPublisher publisher;

        private Workflow getOrCreateWorkflow(Document document) {
                return workflowRepository
                                .findTopByDocumentReferenceOrderByCreatedAtDesc(document.getReference())
                                .orElseGet(Workflow::new);
        }

        /**
         * Méthode pour créer une entrée d'historique à partir d'un workflow
         */
        private void createHistorique(Workflow workflow) {
                WorkflowHistorique historique = new WorkflowHistorique(workflow);
                workflowHistoriqueRepository.save(historique);
        }

        /**
         * Valide que l'utilisateur est bien le destinataire assigné dans le dernier
         * workflow
         */
        private void validateDestinataire(Workflow workflow, User user, String action) {
                if (workflow.getDestinataire() == null) {
                        throw new RuntimeException("Aucun destinataire assigné pour cette action");
                }

                if (!workflow.getDestinataire().getMatricule().equals(user.getMatricule())) {
                        throw new RuntimeException(
                                        "Action non autorisée: Seul " + workflow.getDestinataire().getUsername() +
                                                        " (matricule: " + workflow.getDestinataire().getMatricule() +
                                                        ") peut effectuer cette action (" + action + ")");
                }
        }

        /**
         * Valide que l'utilisateur appartient au service assigné
         */
        private void validateServiceMember(Workflow workflow, User user, String action) {
                if (workflow.getService() == null) {
                        throw new RuntimeException("Aucun service assigné pour cette action");
                }

                if (user.getService() == null ||
                                !user.getService().getIdService().equals(workflow.getService().getIdService())) {
                        throw new RuntimeException(
                                        "Action non autorisée: Vous n'appartenez pas au service " +
                                                        workflow.getService().getServiceName()
                                                        + " assigné pour ce document");
                }
        }

        private Workflow updateDocumentAndWorkflow(Document document, String documentStatus,
                        Workflow workflow, String workflowType,
                        String action, String workflowStatus,
                        User acteur, User destinataire,
                        ServiceDfcr service, String remarque) {
                document.setStatus(documentStatus);
                documentRepository.save(document);

                workflow.setDocument(document);
                workflow.setTypeWorkflow(workflowType);
                workflow.setAction(action);
                workflow.setStatus(workflowStatus);
                workflow.setActeur(acteur);
                workflow.setDestinataire(destinataire);
                workflow.setService(service);
                workflow.setRemarque(remarque);

                Workflow savedWorkflow = workflowRepository.save(workflow);

                createHistorique(savedWorkflow);

                return savedWorkflow;
        }

        /**
         * 1. Document arrive au Directeur - Status: EN_ATTENTE
         */
        @Transactional
        public Workflow documentArriveDirecteur(Document document, User directeur) {
                Workflow workflow = getOrCreateWorkflow(document);
                Workflow savedWorkflow = updateDocumentAndWorkflow(document, "en_attente", workflow,
                                "RECEPTION", "RECEVOIR", "en_attente",
                                null, directeur, null,
                                "Document créé et en attente de traitement");

                if (directeur != null) {
                        publisher.publishEvent(
                                        new NotificationEvent(
                                                        "RECEPTION",
                                                        null,
                                                        directeur,
                                                        savedWorkflow));
                }

                return savedWorkflow;
        }

        /**
         * 2. Directeur envoie à plusieurs services (pour action/pour suivi)
         */
        @Transactional
        public List<Workflow> directeurEnvoieServices(String reference, User directeur,
                        List<ServiceDfcr> services, String typeWorkflow,
                        String remarque) {
                Document document = documentRepository.findById(reference)
                                .orElseThrow(() -> new RuntimeException("Document non trouvé"));

                Workflow workflowPrincipal = getOrCreateWorkflow(document);

                validateDestinataire(workflowPrincipal, directeur, "envoyer aux services");

                List<Workflow> workflows = new ArrayList<>();

                for (ServiceDfcr service : services) {
                        User chefService = service.getUsers().stream()
                                        .filter(user -> user.getFonction() != null &&
                                                        user.getFonction().toLowerCase().contains("chef"))
                                        .findFirst()
                                        .orElse(null);

                        Workflow workflow = new Workflow();
                        workflow.setDocument(document);
                        workflow.setTypeWorkflow(typeWorkflow);
                        workflow.setAction("ENVOYER");
                        workflow.setStatus("au_service");
                        workflow.setActeur(directeur);
                        workflow.setDestinataire(chefService);
                        workflow.setService(service);
                        workflow.setRemarque(remarque);

                        Workflow savedWorkflow = workflowRepository.save(workflow);
                        createHistorique(savedWorkflow);
                        workflows.add(savedWorkflow);

                        if (chefService != null) {
                                publisher.publishEvent(
                                                new NotificationEvent(
                                                                "ENVOI_SERVICE",
                                                                directeur,
                                                                chefService,
                                                                savedWorkflow));
                        }
                }

                document.setStatus("au_service");
                documentRepository.save(document);

                return workflows;
        }

        /**
         * 2bis. Directeur envoie à un seul service (méthode de compatibilité)
         */
        @Transactional
        public Workflow directeurEnvoieService(String reference, User directeur,
                        ServiceDfcr service, String typeWorkflow,
                        String remarque) {
                List<ServiceDfcr> services = new ArrayList<>();
                services.add(service);
                List<Workflow> workflows = directeurEnvoieServices(reference, directeur, services, typeWorkflow,
                                remarque);
                return workflows.get(0);
        }

        /**
         * 3. Chef de service assigne à plusieurs employés
         */
        @Transactional
        public List<Workflow> chefAssigneEmployes(String reference, User chefService,
                        List<User> employes, String remarque) {
                Document document = documentRepository.findById(reference)
                                .orElseThrow(() -> new RuntimeException("Document non trouvé"));

                Workflow workflowPrincipal = getOrCreateWorkflow(document);

                validateServiceMember(workflowPrincipal, chefService, "assigner à des employés");

                ServiceDfcr service = workflowPrincipal.getService();
                List<Workflow> workflows = new ArrayList<>();

                for (User employe : employes) {
                        if (employe.getService() == null ||
                                        !employe.getService().getIdService().equals(service.getIdService())) {
                                throw new RuntimeException(
                                                "L'employé " + employe.getUsername() +
                                                                " doit appartenir au service "
                                                                + service.getServiceName());
                        }

                        // Créer un nouveau workflow pour chaque employé
                        Workflow workflow = new Workflow();
                        workflow.setDocument(document);
                        workflow.setTypeWorkflow("ASSIGNATION");
                        workflow.setAction("ASSIGNER");
                        workflow.setStatus("assigne");
                        workflow.setActeur(chefService);
                        workflow.setDestinataire(employe);
                        workflow.setService(service);
                        workflow.setRemarque(remarque);

                        Workflow savedWorkflow = workflowRepository.save(workflow);
                        createHistorique(savedWorkflow);
                        workflows.add(savedWorkflow);

                        // Envoyer notification à l'employé
                        publisher.publishEvent(
                                        new NotificationEvent(
                                                        "ASSIGNATION",
                                                        chefService,
                                                        employe,
                                                        savedWorkflow));
                }

                // Mettre à jour le statut du document
                document.setStatus("assigne");
                documentRepository.save(document);

                return workflows;
        }

        /**
         * 3bis. Chef de service assigne à un seul employé (méthode de compatibilité)
         */
        @Transactional
        public Workflow chefAssigneEmploye(String reference, User chefService,
                        User employe, String remarque) {
                List<User> employes = new ArrayList<>();
                employes.add(employe);
                List<Workflow> workflows = chefAssigneEmployes(reference, chefService, employes, remarque);
                return workflows.get(0);
        }

        /**
         * 4. Employé commence le traitement
         */
        @Transactional
        public Workflow employeCommenceTraitement(String reference, User employe) {
                Document document = documentRepository.findById(reference)
                                .orElseThrow(() -> new RuntimeException("Document non trouvé"));

                Workflow workflow = getOrCreateWorkflow(document);

                validateDestinataire(workflow, employe, "commencer le traitement");

                ServiceDfcr service = workflow.getService();
                Workflow savedWorkflow = updateDocumentAndWorkflow(document, "en_traitement", workflow,
                                "TRAITEMENT", "TRAITER", "en_traitement",
                                employe, null, service, "Document en cours de traitement");

                return savedWorkflow;
        }

        /**
         * 5. Employé termine et envoie au chef
         */
        @Transactional
        public Workflow employeTermineEtEnvoie(String reference, User employe,
                        User chefService, String remarque) {
                Document document = documentRepository.findById(reference)
                                .orElseThrow(() -> new RuntimeException("Document non trouvé"));

                Workflow workflow = getOrCreateWorkflow(document);

                if (workflow.getActeur() == null ||
                                !workflow.getActeur().getMatricule().equals(employe.getMatricule())) {
                        throw new RuntimeException(
                                        "Action non autorisée: Seul l'employé qui traite le document peut le soumettre");
                }

                ServiceDfcr service = workflow.getService();
                Workflow savedWorkflow = updateDocumentAndWorkflow(document, "termine", workflow,
                                "SOUMISSION", "SOUMETTRE", "termine",
                                employe, chefService, service, remarque);

                publisher.publishEvent(
                                new NotificationEvent(
                                                "SOUMISSION",
                                                employe,
                                                chefService,
                                                savedWorkflow));

                return savedWorkflow;
        }

        /**
         * 6a. Chef valide et envoie au directeur
         */
        @Transactional
        public Workflow chefValideEtEnvoieDirecteur(String reference, User chefService,
                        User directeur, String remarque) {
                Document document = documentRepository.findById(reference)
                                .orElseThrow(() -> new RuntimeException("Document non trouvé"));

                Workflow workflow = getOrCreateWorkflow(document);

                validateDestinataire(workflow, chefService, "valider et envoyer au directeur");

                ServiceDfcr service = workflow.getService();
                Workflow savedWorkflow = updateDocumentAndWorkflow(document, "validation_directeur", workflow,
                                "VALIDATION_CHEF", "VALIDER", "validation_directeur",
                                chefService, directeur, service, remarque);

                publisher.publishEvent(
                                new NotificationEvent(
                                                "VALIDATION_CHEF",
                                                chefService,
                                                directeur,
                                                savedWorkflow));

                return savedWorkflow;
        }

        /**
         * 6b. Chef refuse - à refaire
         */
        @Transactional
        public Workflow chefRefuseDocument(String reference, User chefService,
                        User employe, String remarque) {
                Document document = documentRepository.findById(reference)
                                .orElseThrow(() -> new RuntimeException("Document non trouvé"));

                Workflow workflow = getOrCreateWorkflow(document);

                validateDestinataire(workflow, chefService, "refuser le document");

                ServiceDfcr service = workflow.getService();
                Workflow savedWorkflow = updateDocumentAndWorkflow(document, "au_service", workflow,
                                "VALIDATION_CHEF", "REFUSER", "au_service",
                                chefService, employe, service, remarque);

                publisher.publishEvent(
                                new NotificationEvent(
                                                "REFUS_CHEF",
                                                chefService,
                                                employe,
                                                savedWorkflow));

                return savedWorkflow;
        }

        /**
         * 7a. Directeur valide comme COMPLET
         */
        @Transactional
        public Workflow directeurValideComplet(String reference, User directeur,
                        String remarque) {
                Document document = documentRepository.findById(reference)
                                .orElseThrow(() -> new RuntimeException("Document non trouvé"));

                Workflow workflow = getOrCreateWorkflow(document);

                validateDestinataire(workflow, directeur, "valider comme complet");

                workflow.setEstComplet(true);
                ServiceDfcr service = workflow.getService();

                Workflow savedWorkflow = updateDocumentAndWorkflow(document, "complet", workflow,
                                "VALIDATION_DIRECTEUR", "VALIDER", "complet",
                                directeur, null, service, remarque);

                publisher.publishEvent(
                                new NotificationEvent(
                                                "VALIDATION_DIRECTEUR",
                                                directeur,
                                                null,
                                                savedWorkflow));

                return savedWorkflow;
        }

        /**
         * 7b. Directeur refuse - INCOMPLET
         */
        @Transactional
        public Workflow directeurRefuseIncomplet(String reference, User directeur,
                        ServiceDfcr service, String remarque) {
                Document document = documentRepository.findById(reference)
                                .orElseThrow(() -> new RuntimeException("Document non trouvé"));

                Workflow workflow = getOrCreateWorkflow(document);

                validateDestinataire(workflow, directeur, "refuser comme incomplet");

                workflow.setEstComplet(false);

                Workflow savedWorkflow = updateDocumentAndWorkflow(document, "au_service", workflow,
                                "VALIDATION_DIRECTEUR", "REFUSER", "au_service",
                                directeur, null, service, remarque);

                publisher.publishEvent(
                                new NotificationEvent(
                                                "REFUS_DIRECTEUR",
                                                directeur,
                                                null,
                                                savedWorkflow));

                return savedWorkflow;
        }

        /**
         * Récupérer l'historique complet d'un document
         */
        public List<WorkflowHistoriqueDTO> getWorkflowHistory(String reference) {
                List<WorkflowHistorique> historiques = workflowHistoriqueRepository
                                .findByDocument_ReferenceOrderByCreatedAtAsc(reference);

                return historiques.stream().map(this::toHistoriqueDto).toList();
        }

        private WorkflowHistoriqueDTO toHistoriqueDto(WorkflowHistorique historique) {
                WorkflowHistoriqueDTO dto = new WorkflowHistoriqueDTO();
                dto.setReference(historique.getDocument().getReference());
                dto.setTypeWorkflow(historique.getTypeWorkflow());
                dto.setAction(historique.getAction());
                dto.setStatus(historique.getStatus());

                if (historique.getActeur() != null) {
                        dto.setMatriculeActeur(historique.getActeur().getMatricule());
                        dto.setActeurFonction(historique.getActeur().getFonction());
                }
                dto.setServiceId(historique.getService().getIdService());
                dto.setRemarque(historique.getRemarque());
                dto.setEstComplet(historique.getEstComplet());
                dto.setCreatedAt(historique.getCreatedAt());

                return dto;
        }

        public List<Workflow> getDocumentsEnAttente() {
                return workflowRepository.findByStatus("en_attente");
        }

        public List<Workflow> getDocumentsAFaire(String matricule) {
                return workflowRepository.findByDestinataire_MatriculeAndStatus(matricule, "au_service");
        }

        public List<Workflow> getDocumentsService(String idService, String status) {
                if (status == null || status.isEmpty()) {
                        return workflowRepository.findByService_IdService(idService);
                }
                return workflowRepository.findByService_IdServiceAndStatus(idService, status);
        }

        public List<WorkflowHistoriqueDTO> getAllWorkflowHistories() {
                List<WorkflowHistorique> historiques = workflowHistoriqueRepository.findAllByOrderByCreatedAtDesc();

                return historiques.stream()
                                .map(this::toHistoriqueDto)
                                .toList();
        }

        public List<WorkflowHistoriqueDTO> getWorkflowHistoryByService(String idService) {
                List<WorkflowHistorique> historiques = workflowHistoriqueRepository
                                .findByService_IdServiceOrderByCreatedAtDesc(idService);

                return historiques.stream()
                                .map(this::toHistoriqueDto)
                                .toList();
        }

        public List<CompletedDocumentDto> getCompletedDocumentsByService(
                        String idService, Integer month, Integer year) {

                String service = idService.toUpperCase();
                List<Workflow> workflows;

                if (month != null && year != null) {
                        workflows = workflowRepository.findCompletedByServiceAndMonthYear(service, month, year);
                } else {
                        workflows = workflowRepository.findCompletedByService(service);
                }

                return workflows.stream()
                                .filter(Objects::nonNull)
                                .map(workflow -> {
                                        Document doc = workflow.getDocument();
                                        User creator = doc.getCreator();

                                        return new CompletedDocumentDto(
                                                        doc.getReference(),
                                                        doc.getObjet(),
                                                        doc.getCorps(),
                                                        doc.getType(),
                                                        doc.getStatus(),
                                                        creator.getMatricule(),
                                                        creator.getUsername() + " " + creator.getSurname(),
                                                        creator.getEmail(),
                                                        doc.getCreatedAt(),
                                                        doc.getUpdatedAt());
                                })
                                .toList();
        }
}