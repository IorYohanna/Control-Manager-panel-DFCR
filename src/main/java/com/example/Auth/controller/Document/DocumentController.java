package com.example.Auth.controller.Document;

import com.example.Auth.dto.Document.DocumentDto;
import com.example.Auth.dto.Document.DocumentResponseDto;
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
    public ResponseEntity<List<DocumentResponseDto>> getAllDocument() {
        List<DocumentResponseDto> documents = documentService.getAllDocuments()
                .stream()
                .map(doc -> new DocumentResponseDto(
                        doc.getReference(),
                        doc.getObjet(),
                        doc.getCorps(),
                        doc.getType(),
                        doc.getStatus(),
                        doc.getCreator().getMatricule(),
                        doc.getCreator().getName(),
                        doc.getCreator().getUsername()
                ))
                .toList();
        return ResponseEntity.ok(documents);
    }

    @PostMapping(value = "/create", consumes = "multipart/form-data")
    public ResponseEntity<DocumentResponseDto> createDocument(
            @RequestParam("reference") String reference,
            @RequestParam("objet") String objet,
            @RequestParam("corps") String corps,
            @RequestParam("type") String type,
            @RequestParam("status") String status,
            @RequestParam("pieceJointe") MultipartFile pieceJointe) {
        try {
            Document doc = documentService.createDocument(
                    reference, objet, corps, type, status, pieceJointe);
            DocumentResponseDto responseDto = new DocumentResponseDto(
                    doc.getReference(),
                    doc.getObjet(),
                    doc.getCorps(),
                    doc.getType(),
                    doc.getStatus(),
                    doc.getCreator().getMatricule(),
                    doc.getCreator().getName(),
                    doc.getCreator().getUsername()
            );


            return ResponseEntity.ok(responseDto);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{reference}")
    public ResponseEntity<DocumentResponseDto> getDocumentByReference(@PathVariable String reference) {
        return documentService.getDocumentByReference(reference)
                .map(doc -> new DocumentResponseDto(
                        doc.getReference(),
                        doc.getObjet(),
                        doc.getCorps(),
                        doc.getType(),
                        doc.getStatus(),
                        doc.getCreator().getMatricule(),
                        doc.getCreator().getName(),
                        doc.getCreator().getUsername()
                ))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{reference}")
    public ResponseEntity<DocumentResponseDto> updateDocument(@PathVariable String reference,
            @RequestBody DocumentDto documentDto) {
        Document updatedDocument = documentService.updateDocument(reference, documentDto);

        DocumentResponseDto responseDto = new DocumentResponseDto(
                updatedDocument.getReference(),
                updatedDocument.getObjet(),
                updatedDocument.getCorps(),
                updatedDocument.getType(),
                updatedDocument.getStatus(),
                updatedDocument.getCreator().getMatricule(),
                updatedDocument.getCreator().getName(),
                updatedDocument.getCreator().getUsername()
        );
        return ResponseEntity.ok(responseDto);
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
