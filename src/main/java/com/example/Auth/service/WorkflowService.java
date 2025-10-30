package com.example.Auth.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.example.Auth.dto.WorkflowDto;
import com.example.Auth.model.Document;
import com.example.Auth.model.Workflow;
import com.example.Auth.repository.DocumentRepository;
import com.example.Auth.repository.WorkflowRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class WorkflowService {

    private final DocumentRepository documentRepository;
    private final WorkflowRepository workflowRepository;

    public Workflow createWorkflow(WorkflowDto dto) {
        Document document = documentRepository.findById(dto.getReference())
                .orElseThrow(() -> new RuntimeException("Document introuvable : " + dto.getReference()));

        Workflow workflow = new Workflow();
        workflow.setTypeWorkflow(dto.getTypeWorkflow());
        workflow.setAction(dto.getAction());
        workflow.setStatus(dto.getStatus());
        workflow.setDocument(document);

        return workflowRepository.save(workflow);
    }

    public Workflow initializeWorkflow(Document document) {
        Workflow workflow = new Workflow();
        workflow.setDocument(document);
        workflow.setAction("Validation");
        workflow.setStatus("A_FAIRE");
        workflow.setTypeWorkflow("standart");
        return workflowRepository.save(workflow);

    }

    public Workflow updateWorkflowStatus(String reference, String newAction) {
        Document document = documentRepository.findById(reference)
                .orElseThrow(() -> new RuntimeException("Document introuvable : " + reference));

        Workflow workflow = workflowRepository.findByDocument(document)
                .orElseThrow(() -> new RuntimeException("Aucun workflow trouvé pour ce document"));

        String currentStatus = document.getStatus();
        String nextStatus;

        switch (currentStatus.toUpperCase()) {
            case "A_FAIRE" -> nextStatus = "EN_COURS";
            case "EN_COURS" -> nextStatus = "TERMINE";
            default -> throw new RuntimeException("Le document est déjà terminé ou a un statut invalide");
        }

        workflow.setAction(newAction);
        workflow.setStatus(nextStatus);
        workflow.setUpdatedAt(LocalDateTime.now());
        workflowRepository.save(workflow);

        document.setStatus(nextStatus);
        document.setUpdatedAt(LocalDateTime.now());
        documentRepository.save(document);

        return workflow;
    }

}
