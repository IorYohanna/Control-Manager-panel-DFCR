package com.example.Auth.dto.Workflow;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class WorkflowHistorique {
    private String reference;
    private String typeWorkflow;
    private String action;
    private String status;
    private String matriculeActeur;
    private String acteurFonction;
    private String remarque;
    private Boolean estComplet;
    private LocalDateTime createdAt;
}
