package com.example.Auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Auth.model.Workflow;

@Repository
public interface WorkflowRepository extends JpaRepository<Workflow,Long> {
} 
