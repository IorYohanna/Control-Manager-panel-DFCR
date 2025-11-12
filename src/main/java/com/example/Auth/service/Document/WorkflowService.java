package com.example.Auth.service.Document;

import com.example.Auth.model.Document.Document;
import com.example.Auth.model.Document.Workflow;
import com.example.Auth.model.User.User;
import com.example.Auth.model.User.ServiceDfcr;
import com.example.Auth.repository.Document.DocumentRepository;
import com.example.Auth.repository.Document.WorkflowRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WorkflowService {

    @Autowired
    private WorkflowRepository workflowRepository;

    @Autowired
    private DocumentRepository documentRepository;


    private Workflow getOrCreateWorkflow(Document document) {
        return workflowRepository
                .findTopByDocumentReferenceOrderByCreatedAtDesc(document.getReference())
                .orElseGet(Workflow::new);
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

        return workflowRepository.save(workflow);
    }


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
        return updateDocumentAndWorkflow(document, "assigne", workflow,
                "ASSIGNATION", "ASSIGNER", "assigne",
                chefService, employe, null, remarque);
    }

    /**
     * 4. Employé commence le traitement
     */
    @Transactional
    public Workflow employeCommenceTraitement(String reference, User employe) {
        Document document = documentRepository.findById(reference)
                .orElseThrow(() -> new RuntimeException("Document non trouvé"));

        Workflow workflow = getOrCreateWorkflow(document);
        return updateDocumentAndWorkflow(document, "en_traitement", workflow,
                "TRAITEMENT", "TRAITER", "en_traitement",
                employe, null, null, "Document en cours de traitement");
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
        return updateDocumentAndWorkflow(document, "termine", workflow,
                "SOUMISSION", "SOUMETTRE", "termine",
                employe, chefService, null, remarque);
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
        return updateDocumentAndWorkflow(document, "validation_validation", workflow,
                "VALIDATION_CHEF", "VALIDER", "validation_directeur",
                chefService, directeur, null, remarque);
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
        return updateDocumentAndWorkflow(document, "au_service", workflow,
                "VALIDATION_CHEF", "REFUSER", "au_service",
                chefService, employe, null, remarque);
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

        return updateDocumentAndWorkflow(document, "complet", workflow,
                "VALIDATION_DIRECTEUR", "VALIDER", "complet",
                directeur, null, null, remarque);
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

        return updateDocumentAndWorkflow(document, "refuse", workflow,
                "VALIDATION_DIRECTEUR", "REFUSER", "refuse",
                directeur, null, service, remarque);
    }


    public List<Workflow> getWorkflowHistory(String reference) {
        return workflowRepository.findByDocument_ReferenceOrderByCreatedAtAsc(reference);
    }

    public List<Workflow> getDocumentsEnAttente(String matricule) {
        return workflowRepository.findByDestinataire_MatriculeAndStatus(matricule, "en_attente");
    }

    public List<Workflow> getDocumentsAFaire(String matricule) {
        return workflowRepository.findByDestinataire_MatriculeAndStatus(matricule, "au_service");
    }
}
