package com.example.Auth.repository.Document;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Auth.model.Document.Workflow;
import com.example.Auth.model.Document.Document;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkflowRepository extends JpaRepository<Workflow, Long> {

    Optional<Workflow> findByDocument(Document document);

    List<Workflow> findByDocument_ReferenceOrderByCreatedAtDesc(String reference);

    List<Workflow> findByDocument_ReferenceOrderByCreatedAtAsc(String reference);

    Optional<Workflow> findFirstByDocument_ReferenceOrderByCreatedAtDesc(String reference);

    List<Workflow> findByActeur_Matricule(String matricule);

    List<Workflow> findByDestinataire_Matricule(String matricule);

    List<Workflow> findByDestinataire_MatriculeAndStatus(String matricule, String status);

    Long countByDestinataire_MatriculeAndStatus(String matricule, String status);
}
