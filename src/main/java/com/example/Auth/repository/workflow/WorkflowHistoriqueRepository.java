package com.example.Auth.repository.workflow;

import com.example.Auth.model.workflow.WorkflowHistorique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkflowHistoriqueRepository extends JpaRepository<WorkflowHistorique, Long> {
    
    List<WorkflowHistorique> findByDocument_ReferenceOrderByCreatedAtAsc(String reference);
    
    List<WorkflowHistorique> findByDocument_ReferenceOrderByCreatedAtDesc(String reference);
    
    List<WorkflowHistorique> findByActeur_MatriculeOrderByCreatedAtDesc(String matricule);
    }