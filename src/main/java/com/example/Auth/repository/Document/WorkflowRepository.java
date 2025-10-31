package com.example.Auth.repository.Document;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Auth.model.Document.Document;
import com.example.Auth.model.Document.Workflow;

import java.util.Optional;


@Repository
public interface WorkflowRepository extends JpaRepository<Workflow,Long> {
    
    Optional<Workflow> findByDocument(Document document);
} 
