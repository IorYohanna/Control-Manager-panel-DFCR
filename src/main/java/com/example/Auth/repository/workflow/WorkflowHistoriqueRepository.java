package com.example.Auth.repository.workflow;

import com.example.Auth.model.workflow.WorkflowHistorique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkflowHistoriqueRepository extends JpaRepository<WorkflowHistorique, Long> {
    
    List<WorkflowHistorique> findByDocument_ReferenceOrderByCreatedAtAsc(String reference);
    
    List<WorkflowHistorique> findByDocument_ReferenceOrderByCreatedAtDesc(String reference);
    
    List<WorkflowHistorique> findByActeur_MatriculeOrderByCreatedAtDesc(String matricule);

    List<WorkflowHistorique> findAllByOrderByCreatedAtDesc();

    List<WorkflowHistorique> findByService_IdServiceOrderByCreatedAtDesc(String idService);

    @Query("""
        SELECT 
            MONTH(w.createdAt) AS month,
            SUM(CASE WHEN w.action = 'REFUSER' THEN 1 ELSE 0 END) AS refused,
            SUM(CASE WHEN w.estComplet = true THEN 1 ELSE 0 END) AS completed
        FROM WorkflowHistorique w
        WHERE YEAR(w.createdAt) = :year
        GROUP BY MONTH(w.createdAt)
        ORDER BY MONTH(w.createdAt)
    """)
    List<Object[]> getMonthlyStats(@Param("year") int year);

    }