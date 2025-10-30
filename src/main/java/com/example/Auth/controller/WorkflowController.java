package com.example.Auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Auth.model.Workflow;
import com.example.Auth.service.WorkflowService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/workflow")
@RequiredArgsConstructor
public class WorkflowController {

    private final WorkflowService workflowService;

    @PutMapping("/{ref}")
    public ResponseEntity<Workflow> updateStatus(
            @PathVariable String ref,
            @RequestParam String action) {
        Workflow updated = workflowService.updateWorkflowStatus(ref, action);
        return ResponseEntity.ok(updated);
    }
}
