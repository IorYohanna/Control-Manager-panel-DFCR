package com.example.Auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Auth.dto.WorkflowResponseDto;
import com.example.Auth.model.Workflow;
import com.example.Auth.service.WorkflowService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/workflow")
@RequiredArgsConstructor
public class WorkflowController {

    private final WorkflowService workflowService;

    @PutMapping("/{ref}")
    public ResponseEntity<WorkflowResponseDto> updateStatus(
            @PathVariable String ref,
            @RequestParam String action) {
        Workflow updated = workflowService.updateWorkflowStatus(ref, action);
        WorkflowResponseDto workflow = new WorkflowResponseDto(
                updated.getIdWorkflow(),
                updated.getTypeWorkflow(),
                updated.getAction(),
                updated.getStatus(),
                updated.getDocument().getReference());
        return ResponseEntity.ok(workflow);
    }
}
