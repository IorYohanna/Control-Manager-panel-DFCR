package com.example.Auth.service;

import com.example.Auth.model.Documents;
import org.springframework.stereotype.Service;

import com.example.Auth.repository.DocumentsRepository;

import java.util.List;
import java.util.Optional;

@Service
public class DocumentsService {
    private DocumentsRepository documentsRepository;

    public DocumentsService(DocumentsRepository documentsRepository) {
        this.documentsRepository = documentsRepository;
    }

    public List<Documents> getAllDocuments() {
        return documentsRepository.findAll();
    }

    public Optional<Documents> getDocumentByReference(String reference) {
        return documentsRepository.findById(reference);
    }

    public Documents saveDocument(Documents document) {
        return documentsRepository.save(document);
    }

    public void deleteDocument(String reference) {
        documentsRepository.deleteById(reference);
    }
}
