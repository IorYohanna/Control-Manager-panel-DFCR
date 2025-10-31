package com.example.Auth.controller.Document;

import com.example.Auth.dto.Document.DocumentDto;
import com.example.Auth.model.Document.Document;
import com.example.Auth.service.Document.DocumentService;

import jakarta.annotation.security.PermitAll;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/documents")
@RestController
public class DocumentController {
    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping
    public ResponseEntity<List<Document>> getAllDocument() {
        List<Document> document = documentService.getAllDocuments();
        return ResponseEntity.ok(document);
    }

    @PostMapping(value = "/create", consumes = "multipart/form-data")
    public ResponseEntity<Document> createDocument(
            @RequestParam("reference") String reference,
            @RequestParam("objet") String objet,
            @RequestParam("corps") String corps,
            @RequestParam("type") String type,
            @RequestParam("status") String status,
            @RequestParam("pieceJointe") MultipartFile pieceJointe) {
        try {
            Document doc = documentService.createDocument(
                    reference, objet, corps, type, status, pieceJointe);
            return ResponseEntity.ok(doc);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{reference}")
    public ResponseEntity<Document> getDocumentByReference(@PathVariable String reference) {
        return documentService.getDocumentByReference(reference)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{reference}")
    public ResponseEntity<Document> updateDocument(@PathVariable String reference,
            @RequestBody DocumentDto documentDto) {
        Document updatedDocument = documentService.updateDocument(reference, documentDto);
        return updatedDocument != null ? ResponseEntity.ok(updatedDocument) : ResponseEntity.notFound().build();
    }

    @GetMapping("/type/{type}")
    public List<Document> getMethodName(@PathVariable String type) {
        return documentService.findByType(type);
    }

    @GetMapping("/download/{reference}")
    @PermitAll
    public ResponseEntity<byte[]> download(@PathVariable String reference) {
        return documentService.downloadDocument(reference);
    }

    @GetMapping("/search")
    public List<Document> search(String keyword) {
        return documentService.searchByKeyword(keyword);
    }

    @DeleteMapping("/{reference}")
    public ResponseEntity<?> deleteDocument(@PathVariable String reference) {
        boolean deleted = documentService.deleteDocument(reference);
        return deleted ? ResponseEntity.ok(Map.of("delete", "Document Supprimer avec succes  "))
                : ResponseEntity.notFound().build();
    }

}
