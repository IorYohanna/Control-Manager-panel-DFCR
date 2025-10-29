package com.example.Auth.service;

import com.example.Auth.dto.DocumentDto;
import com.example.Auth.model.Document;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.Auth.repository.DocumentRepository;

import java.io.IOException;
import java.time.LocalDate;
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
                input.getPieceJointe());

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

    public Document uploadDocument(
            String reference,
            String objet,
            String corps,
            String type,
            String status,
            String dateCreation,
            MultipartFile pieceJointe) throws IOException {

        DocumentDto dto = new DocumentDto();
        dto.setReference(reference);
        dto.setObjet(objet);
        dto.setCorps(corps);
        dto.setType(type);
        dto.setStatus(status);
        dto.setDateCreation(LocalDate.parse(dateCreation));
        dto.setPieceJointe(pieceJointe.getBytes());

        Document doc = new Document();
        doc.setReference(dto.getReference());
        doc.setObjet(dto.getObjet());
        doc.setCorps(dto.getCorps());
        doc.setType(dto.getType());
        doc.setStatus(dto.getStatus());
        doc.setDateCreation(dto.getDateCreation());
        doc.setPieceJointe(dto.getPieceJointe());

        Document savedDoc = documentRepository.save(doc);

        return savedDoc;
    }

    public ResponseEntity<byte[]> downloadDocument(String reference) {
        Optional<Document> docOpt = documentRepository.findById(reference);

        if (docOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Document doc = docOpt.get();
        byte[] fileData = doc.getPieceJointe();

        if (fileData == null || fileData.length == 0) {
            return ResponseEntity.noContent().build();
        }

        String filename = doc.getReference() + "." + doc.getType();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(fileData);
    }

}
