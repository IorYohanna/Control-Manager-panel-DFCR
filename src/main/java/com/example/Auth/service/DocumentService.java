package com.example.Auth.service;

import com.example.Auth.dto.DocumentDto;
import com.example.Auth.model.Document;
import org.springframework.stereotype.Service;

import com.example.Auth.repository.DocumentRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DocumentService {
    private final DocumentRepository documentRepository;

    public DocumentService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    public List<Document> getAllDocuments() {
        return new ArrayList<>(documentRepository.findAll());
    }

    public Optional<Document> getDocumentByReference(String reference) {
        return documentRepository.findById(reference);
    }

    public Document createDocument(DocumentDto input) {
        Document document = new Document(
                input.getReference(),
                input.getObjet(),
                input.getCorps(),
                input.getType(),
                input.getStatus(),
                input.getDateCreation(),
                input.getPieceJointe()
        );

        return documentRepository.save(document);
    }

    public Document updateDocument(String reference, DocumentDto input) {
        Optional<Document> existingDocumentOpt = documentRepository.findById(reference);
        if (existingDocumentOpt.isPresent()) {
            Document existingDocument = existingDocumentOpt.get();
            existingDocument.setObjet(input.getObjet());
            existingDocument.setCorps(input.getCorps());
            existingDocument.setType(input.getType());
            existingDocument.setStatus(input.getStatus());
            existingDocument.setDateCreation(input.getDateCreation());
            existingDocument.setPieceJointe(input.getPieceJointe());

            return documentRepository.save(existingDocument);
        }
        return null;
    }

    public boolean deleteDocument(String reference) {
        Optional<Document> document = documentRepository.findById(reference);
        if (document.isPresent()) {
            documentRepository.deleteById(reference);
            return true;
        }
        return false;
    }
}
