package com.example.Auth.dto.Dashboard;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WorkflowStatisticsDto {
    private int totalWorkflows;
    private int enAttente;
    private int auService;
    private int assigne;
    private int enTraitement;
    private int termine;
    private int validationDirecteur;
    private int complet;
}
