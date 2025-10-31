package com.example.Auth.controller.Document;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Auth.dto.Document.WorkflowDto;
import com.example.Auth.model.Document.Workflow;
import com.example.Auth.service.Document.WorkflowService;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:5173")

@RestController
@RequestMapping("/workflows")
@RequiredArgsConstructor
public class WorkflowController {

    private final WorkflowService workflowService;

    @PostMapping
    public ResponseEntity<Workflow> createWorkflow (@RequestBody WorkflowDto input) {
        Workflow created = workflowService.createWorkflow(input);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/update/{reference}")
    public ResponseEntity<Workflow> updateStatus(
            @PathVariable String reference,
            @RequestBody Map<String, String> payload) {
        String newStatus = payload.get("status");
        return ResponseEntity.ok(workflowService.updateWorkflowStatus(reference, newStatus));
    }

}
