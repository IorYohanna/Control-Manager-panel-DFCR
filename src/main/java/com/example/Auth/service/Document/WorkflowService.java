package com.example.Auth.service.Document;

import com.example.Auth.model.Document.Document;
import com.example.Auth.model.Document.Workflow;
import com.example.Auth.model.User.User;
import com.example.Auth.repository.Document.DocumentRepository;
import com.example.Auth.repository.Document.WorkflowRepository;
import com.example.Auth.model.User.ServiceDfcr;

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

    /**
     * 1. Document arrive au Directeur - Status: EN_ATTENTE
     */
    @Transactional
    public Workflow documentArriveDirecteur(Document document, User directeur) {
        document.setStatus("EN_ATTENTE");
        documentRepository.save(document);
        
        Workflow workflow = new Workflow();
        workflow.setDocument(document);
        workflow.setTypeWorkflow("RECEPTION");
        workflow.setAction("RECEVOIR");
        workflow.setStatus("EN_ATTENTE");
        workflow.setDestinataire(directeur);
        
        return workflowRepository.save(workflow);
    }

    /**
     * 2. Directeur envoie au service (pour action/pour suivi)
     * Status passe à : EN_ATTENTE (en attente du chef de service)
     */
    @Transactional
    public Workflow directeurEnvoieService(String reference, User directeur, 
                                          ServiceDfcr service, String typeWorkflow, 
                                          String remarque) {
        Document document = documentRepository.findById(reference)
            .orElseThrow(() -> new RuntimeException("Document non trouvé"));
        
        document.setStatus("EN_ATTENTE");
        documentRepository.save(document);
        
        Workflow workflow = new Workflow();
        workflow.setDocument(document);
        workflow.setTypeWorkflow(typeWorkflow); // "POUR_ACTION" / "POUR_SUIVI"
        workflow.setAction("ENVOYER");
        workflow.setStatus("EN_ATTENTE");
        workflow.setActeur(directeur);
        workflow.setService(service);
        workflow.setRemarque(remarque);
        
        return workflowRepository.save(workflow);
    }

    /**
     * 3. Chef de service reçoit et assigne à un employé
     * Status passe à : A_FAIRE
     */
    @Transactional
    public Workflow chefAssigneEmploye(String reference, User chefService, 
                                      User employe, String remarque) {
        Document document = documentRepository.findById(reference)
            .orElseThrow(() -> new RuntimeException("Document non trouvé"));
        
        document.setStatus("A_FAIRE");
        documentRepository.save(document);
        
        Workflow workflow = new Workflow();
        workflow.setDocument(document);
        workflow.setTypeWorkflow("ASSIGNATION");
        workflow.setAction("ASSIGNER");
        workflow.setStatus("A_FAIRE");
        workflow.setActeur(chefService);
        workflow.setDestinataire(employe);
        workflow.setRemarque(remarque);
        
        return workflowRepository.save(workflow);
    }

    /**
     * 4. Employé commence le traitement
     * Status passe à : EN_PROGRESSION
     */
    @Transactional
    public Workflow employeCommenceTraitement(String reference, User employe) {
        Document document = documentRepository.findById(reference)
            .orElseThrow(() -> new RuntimeException("Document non trouvé"));
        
        document.setStatus("EN_PROGRESSION");
        documentRepository.save(document);
        
        Workflow workflow = new Workflow();
        workflow.setDocument(document);
        workflow.setTypeWorkflow("TRAITEMENT");
        workflow.setAction("TRAITER");
        workflow.setStatus("EN_PROGRESSION");
        workflow.setActeur(employe);
        
        return workflowRepository.save(workflow);
    }

    /**
     * 5. Employé termine et envoie au chef
     * Status passe à : TERMINE
     */
    @Transactional
    public Workflow employeTermineEtEnvoie(String reference, User employe, 
                                          User chefService, String remarque) {
        Document document = documentRepository.findById(reference)
            .orElseThrow(() -> new RuntimeException("Document non trouvé"));
        
        document.setStatus("TERMINE");
        documentRepository.save(document);
        
        Workflow workflow = new Workflow();
        workflow.setDocument(document);
        workflow.setTypeWorkflow("SOUMISSION");
        workflow.setAction("SOUMETTRE");
        workflow.setStatus("TERMINE");
        workflow.setActeur(employe);
        workflow.setDestinataire(chefService);
        workflow.setRemarque(remarque);
        
        return workflowRepository.save(workflow);
    }

    /**
     * 6a. Chef valide et envoie au directeur
     * Status reste : TERMINE
     */
    @Transactional
    public Workflow chefValideEtEnvoieDirecteur(String reference, User chefService, 
                                                User directeur, String remarque) {
        Document document = documentRepository.findById(reference)
            .orElseThrow(() -> new RuntimeException("Document non trouvé"));
        
        // Status reste TERMINE
        
        Workflow workflow = new Workflow();
        workflow.setDocument(document);
        workflow.setTypeWorkflow("VALIDATION_CHEF");
        workflow.setAction("VALIDER");
        workflow.setStatus("TERMINE");
        workflow.setActeur(chefService);
        workflow.setDestinataire(directeur);
        workflow.setRemarque(remarque);
        
        return workflowRepository.save(workflow);
    }

    /**
     * 6b. Chef refuse - à refaire
     * Status repasse à : A_FAIRE
     */
    @Transactional
    public Workflow chefRefuseDocument(String reference, User chefService, 
                                      User employe, String remarque) {
        Document document = documentRepository.findById(reference)
            .orElseThrow(() -> new RuntimeException("Document non trouvé"));
        
        document.setStatus("A_FAIRE");
        documentRepository.save(document);
        
        Workflow workflow = new Workflow();
        workflow.setDocument(document);
        workflow.setTypeWorkflow("VALIDATION_CHEF");
        workflow.setAction("REFUSER");
        workflow.setStatus("A_FAIRE");
        workflow.setActeur(chefService);
        workflow.setDestinataire(employe);
        workflow.setRemarque(remarque);
        
        return workflowRepository.save(workflow);
    }

    /**
     * 7a. Directeur valide comme COMPLET
     * Status reste : TERMINE
     */
    @Transactional
    public Workflow directeurValideComplet(String reference, User directeur, 
                                          String remarque) {
        Document document = documentRepository.findById(reference)
            .orElseThrow(() -> new RuntimeException("Document non trouvé"));
        
        // Document reste TERMINE mais marqué comme complet
        
        Workflow workflow = new Workflow();
        workflow.setDocument(document);
        workflow.setTypeWorkflow("VALIDATION_DIRECTEUR");
        workflow.setAction("VALIDER");
        workflow.setStatus("TERMINE");
        workflow.setActeur(directeur);
        workflow.setEstComplet(true);
        workflow.setRemarque(remarque);
        
        return workflowRepository.save(workflow);
    }

    /**
     * 7b. Directeur refuse - INCOMPLET - à refaire
     * Status repasse à : A_FAIRE
     */
    @Transactional
    public Workflow directeurRefuseIncomplet(String reference, User directeur, 
                                            ServiceDfcr service, String remarque) {
        Document document = documentRepository.findById(reference)
            .orElseThrow(() -> new RuntimeException("Document non trouvé"));
        
        document.setStatus("A_FAIRE");
        documentRepository.save(document);
        
        Workflow workflow = new Workflow();
        workflow.setDocument(document);
        workflow.setTypeWorkflow("VALIDATION_DIRECTEUR");
        workflow.setAction("REFUSER");
        workflow.setStatus("A_FAIRE");
        workflow.setActeur(directeur);
        workflow.setService(service);
        workflow.setEstComplet(false);
        workflow.setRemarque(remarque);
        
        return workflowRepository.save(workflow);
    }

    public List<Workflow> getWorkflowHistory(String reference) {
        return workflowRepository.findByDocument_ReferenceOrderByCreatedAtAsc(reference);
    }

    public List<Workflow> getDocumentsEnAttente(String matricule) {
        return workflowRepository.findByDestinataire_MatriculeAndStatus(matricule, "EN_ATTENTE");
    }

    public List<Workflow> getDocumentsAFaire(String matricule) {
        return workflowRepository.findByDestinataire_MatriculeAndStatus(matricule, "A_FAIRE");
    }
}