package com.example.Auth.repository.workflow;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    // ----- * ----- //
    List<Workflow> findByStatus(String status);

    List<Workflow> findByService_IdServiceAndStatus(String idService, String status);

    List<Workflow> findByService_IdService(String idService);

    @Query("""
       SELECT w FROM Workflow w
       JOIN FETCH w.document d
       JOIN FETCH d.creator
       WHERE w.service.idService = :idService
       AND w.estComplet = true
       ORDER BY d.createdAt DESC
       """)
    List<Workflow> findCompletedByService(@Param("idService") String idService);

    @Query("""
       SELECT w FROM Workflow w
       JOIN FETCH w.document d
       JOIN FETCH d.creator
       WHERE w.service.idService = :idService
       AND w.estComplet = true
       AND MONTH(d.createdAt) = :month
       AND YEAR(d.createdAt) = :year
       ORDER BY d.createdAt DESC
       """)
    List<Workflow> findCompletedByServiceAndMonthYear(
            @Param("idService") String idService,
            @Param("month") Integer month,
            @Param("year") Integer year
    );
}
