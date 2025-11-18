package com.example.Auth.repository.workflow;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Auth.model.Document.Document;
import com.example.Auth.model.workflow.Workflow;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkflowRepository extends JpaRepository<Workflow, Long> {

    Optional<Workflow> findByDocument(Document document);

    List<Workflow> findByDocument_ReferenceOrderByCreatedAtDesc(String reference);

    List<Workflow> findByDocumentReference(String reference);

    Optional<Workflow> findFirstByDocument_ReferenceOrderByCreatedAtDesc(String reference);

    List<Workflow> findByActeur_Matricule(String matricule);

    List<Workflow> findByDestinataire_Matricule(String matricule);

    List<Workflow> findByDestinataire_MatriculeAndStatus(String matricule, String status);
    
    List<Workflow> findByActeur_MatriculeAndStatus (String matricule, String status );

    Optional<Workflow> findTopByDocumentReferenceOrderByCreatedAtDesc(String reference);

    Long countByDestinataire_MatriculeAndStatus(String matricule, String status);
}
