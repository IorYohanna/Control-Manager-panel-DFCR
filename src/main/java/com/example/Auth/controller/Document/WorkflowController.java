package com.example.Auth.controller.Document;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Auth.dto.Document.WorkflowDto;
import com.example.Auth.dto.Document.WorkflowResponseDto;
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
    public ResponseEntity<Workflow> createWorkflow(@RequestBody WorkflowDto input) {
        Workflow created = workflowService.createWorkflow(input);
        return ResponseEntity.ok(created);
    }

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
