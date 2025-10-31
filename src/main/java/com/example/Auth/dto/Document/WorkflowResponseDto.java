package com.example.Auth.dto.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class WorkflowResponseDto {
    private Long idWorkflow;
    private String typeWorkflow;
    private String action;
    private String status;
    private String reference;
}
