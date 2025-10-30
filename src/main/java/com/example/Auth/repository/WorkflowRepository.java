package com.example.Auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Auth.model.Workflow;
import com.example.Auth.model.Document;
import java.util.Optional;


@Repository
public interface WorkflowRepository extends JpaRepository<Workflow,Long> {
    Optional<Workflow> findByDocument(Document document);
} 
