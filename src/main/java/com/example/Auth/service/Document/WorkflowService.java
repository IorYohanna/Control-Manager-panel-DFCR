package com.example.Auth.service.Document;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.example.Auth.dto.Document.WorkflowDto;
import com.example.Auth.model.Document.Workflow;
import com.example.Auth.model.Document.Document;
import com.example.Auth.repository.Document.DocumentRepository;
import com.example.Auth.repository.Document.WorkflowRepository;

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
        workflow.setStatus(document.getStatus());
        workflow.setDocument(document);

        return workflowRepository.save(workflow);
    }

    public Workflow updateWorkflowStatus(String reference, String newStatus) {
        
        Document document = documentRepository.findById(reference)
                .orElseThrow(() -> new RuntimeException("Document introuvable : " + reference));

        Workflow workflow = workflowRepository.findByDocument(document)
                .orElseThrow(() -> new RuntimeException("Aucun workflow trouvé pour ce document"));

        if (!newStatus.equalsIgnoreCase("A_FAIRE") &&
                !newStatus.equalsIgnoreCase("EN_COURS") &&
                !newStatus.equalsIgnoreCase("TERMINE")) {
            throw new RuntimeException("Statut invalide. Choisir : A_FAIRE, EN_COURS ou TERMINE");
        }

        workflow.setStatus(newStatus.toUpperCase());
        workflow.setUpdatedAt(LocalDateTime.now());
        workflowRepository.save(workflow);

        document.setStatus(newStatus.toUpperCase());
        document.setUpdatedAt(LocalDateTime.now());
        documentRepository.save(document);

        return workflow;
    }

}
