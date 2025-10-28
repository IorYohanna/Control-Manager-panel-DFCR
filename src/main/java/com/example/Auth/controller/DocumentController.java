package com.example.Auth.controller;

import com.example.Auth.dto.DocumentDto;
import com.example.Auth.model.Document;
import jakarta.annotation.security.PermitAll;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Auth.service.DocumentService;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

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

    @PostMapping
    public ResponseEntity<Document> create(@RequestBody DocumentDto documentDto) {
        Document document = documentService.createDocument(documentDto);
        return ResponseEntity.ok(document);
    }

    @GetMapping("/{reference}")
    public ResponseEntity<Document> getDocumentByReference(@PathVariable String reference) {
        return documentService.getDocumentByReference(reference)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{reference}")
    public ResponseEntity<Document> updateDocument(@PathVariable String reference, @RequestBody DocumentDto documentDto) {
        Document updatedDocument = documentService.updateDocument(reference, documentDto);
        return updatedDocument != null ? ResponseEntity.ok(updatedDocument) : ResponseEntity.notFound().build();
    }

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<Document> uploadDocument(
            @RequestParam("reference") String reference,
            @RequestParam("objet") String objet,
            @RequestParam("corps") String corps,
            @RequestParam("type") String type,
            @RequestParam("status") String status,
            @RequestParam("dateCreation") String dateCreation,
            @RequestParam("file") MultipartFile pieceJointe
    ) {
        try {
            DocumentDto dto = new DocumentDto();
            dto.setReference(reference);
            dto.setObjet(objet);
            dto.setCorps(corps);
            dto.setType(type);
            dto.setStatus(status);
            dto.setDateCreation(LocalDate.parse(dateCreation));
            dto.setPieceJointe(pieceJointe.getBytes());

            Document document = documentService.createDocument(dto);
            return ResponseEntity.ok(document);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }


    @GetMapping("/download/{reference}")
    @PermitAll
    public ResponseEntity<byte[]> download(@PathVariable String reference) {
        Optional<Document> docOpt = documentService.getDocumentByReference(reference);
        if (docOpt.isPresent()) {
            Document doc = docOpt.get();
            byte[] fileData = doc.getPieceJointe();
            if (fileData == null) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"" + doc.getReference() + "." + doc.getType() + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(fileData);
        }
        return ResponseEntity.notFound().build();
    }



    @DeleteMapping("/{reference}")
    public ResponseEntity<?> deleteDocument(@PathVariable String reference) {
        boolean deleted = documentService.deleteDocument(reference);
        return deleted ? ResponseEntity.ok("Supprimé avec succès") : ResponseEntity.notFound().build();
    }



}
