package com.example.Auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WorkflowDto {
    private String typeWorkflow;
    private String action;
    private String status;
    private String reference;
}
