package com.example.Auth.service.workflow;

import com.example.Auth.dto.Workflow.WorkflowHistoriqueDTO;
import com.example.Auth.model.Document.Document;
import com.example.Auth.model.User.User;
import com.example.Auth.model.workflow.Workflow;
import com.example.Auth.model.workflow.WorkflowHistorique;
import com.example.Auth.model.User.ServiceDfcr;
import com.example.Auth.repository.Document.DocumentRepository;
import com.example.Auth.repository.workflow.WorkflowRepository;
import com.example.Auth.repository.workflow.WorkflowHistoriqueRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
        
        // Créer une entrée d'historique
        createHistorique(savedWorkflow);
        
        return savedWorkflow;
    }

    //en_attente assigne en_traitement termine validation_directeur au_service complet
    //type : RECEPTION , ENVOYER , ASSIGNATION, TRAITEMENT, SOUMISSION, VALIDATION_CHEF, VALIDATION_DIRECTEUR


    /**
     * 1. Document arrive au Directeur - Status: EN_ATTENTE
     */
    @Transactional
    public Workflow documentArriveDirecteur(Document document, User directeur) {
        Workflow workflow = getOrCreateWorkflow(document);
        return updateDocumentAndWorkflow(document, "en_attente", workflow,
                "RECEPTION", "RECEVOIR", "en_attente",
                null, directeur, null,
                "Document créé et en attente de traitement");
    }

    /**
     * 2. Directeur envoie au service (pour action/pour suivi)
     */
    @Transactional
    public Workflow directeurEnvoieService(String reference, User directeur,
            ServiceDfcr service, String typeWorkflow,
            String remarque) {
        Document document = documentRepository.findById(reference)
                .orElseThrow(() -> new RuntimeException("Document non trouvé"));

        Workflow workflow = getOrCreateWorkflow(document);
        return updateDocumentAndWorkflow(document, "au_service", workflow,
                typeWorkflow, "ENVOYER", "au_service",
                directeur, null, service, remarque);
    }

    /**
     * 3. Chef de service assigne à un employé
     */
    @Transactional
    public Workflow chefAssigneEmploye(String reference, User chefService,
            User employe, String remarque) {
        Document document = documentRepository.findById(reference)
                .orElseThrow(() -> new RuntimeException("Document non trouvé"));

        Workflow workflow = getOrCreateWorkflow(document);
        ServiceDfcr service = workflow.getService();
        return updateDocumentAndWorkflow(document, "assigne", workflow,
                "ASSIGNATION", "ASSIGNER", "assigne",
                chefService, employe, service, remarque);
    }

    /**
     * 4. Employé commence le traitement
     */
    @Transactional
    public Workflow employeCommenceTraitement(String reference, User employe) {
        Document document = documentRepository.findById(reference)
                .orElseThrow(() -> new RuntimeException("Document non trouvé"));

        Workflow workflow = getOrCreateWorkflow(document);
        ServiceDfcr service = workflow.getService();
        return updateDocumentAndWorkflow(document, "en_traitement", workflow,
                "TRAITEMENT", "TRAITER", "en_traitement",
                employe, null, service, "Document en cours de traitement");
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
        ServiceDfcr service = workflow.getService();
        return updateDocumentAndWorkflow(document, "termine", workflow,
                "SOUMISSION", "SOUMETTRE", "termine",
                employe, chefService, service, remarque);
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
        ServiceDfcr service = workflow.getService();
        return updateDocumentAndWorkflow(document, "validation_directeur", workflow,
                "VALIDATION_CHEF", "VALIDER", "validation_directeur",
                chefService, directeur, service, remarque);
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
        ServiceDfcr service = workflow.getService();
        return updateDocumentAndWorkflow(document, "au_service", workflow,
                "VALIDATION_CHEF", "REFUSER", "au_service",
                chefService, employe, service, remarque);
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
        workflow.setEstComplet(true);
        ServiceDfcr service = workflow.getService();

        return updateDocumentAndWorkflow(document, "complet", workflow,
                "VALIDATION_DIRECTEUR", "VALIDER", "complet",
                directeur, null, service, remarque);
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
        workflow.setEstComplet(false);

        return updateDocumentAndWorkflow(document, "au_service", workflow,
                "VALIDATION_DIRECTEUR", "REFUSER", "au_service",
                directeur, null, service, remarque);
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
        
        dto.setRemarque(historique.getRemarque());
        dto.setEstComplet(historique.getEstComplet());
        dto.setCreatedAt(historique.getCreatedAt());
        
        return dto;
    }

    public List<Workflow> getDocumentsEnAttente(String matricule) {
        return workflowRepository.findByDestinataire_MatriculeAndStatus(matricule, "en_attente");
    }

    public List<Workflow> getDocumentsAFaire(String matricule) {
        return workflowRepository.findByDestinataire_MatriculeAndStatus(matricule, "au_service");
    }

    public List<Workflow> getDocumentsService(String idService, String status) {
        if (status == null || status.isEmpty()) {
            // Si status est null ou vide, retourne tous les workflows du service
            return workflowRepository.findByService_IdService(idService);
        }
        return workflowRepository.findByService_IdServiceAndStatus(idService, status);
    }

}
