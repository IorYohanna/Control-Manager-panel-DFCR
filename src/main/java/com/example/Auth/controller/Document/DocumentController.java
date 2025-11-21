package com.example.Auth.controller.Document;

import com.example.Auth.dto.Document.DocumentDto;
import com.example.Auth.dto.Document.DocumentHistoriqueDto;
import com.example.Auth.dto.Document.DocumentResponseDto;
import com.example.Auth.model.Document.Document;
import com.example.Auth.service.Document.DocumentService;

import jakarta.annotation.security.PermitAll;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.print.PrintException;

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
                        doc.getCreator().getUsername(),
                        doc.getCreator().getSurname(),
                        doc.getCreatedAt().toString(),
                        doc.getUpdatedAt().toString()))
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
                    doc.getCreator().getUsername(),
                    doc.getCreatedAt().toString(),
                    doc.getUpdatedAt().toString());

            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            e.printStackTrace(); // ← Ajoutez ceci pour voir l'erreur exacte
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
                        doc.getCreator().getUsername(),
                        doc.getCreatedAt().toString(),
                        doc.getUpdatedAt().toString()))
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
                updatedDocument.getCreator().getUsername(),
                updatedDocument.getCreatedAt().toString(),
                updatedDocument.getUpdatedAt().toString());
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

    @PostMapping("/print/{reference}")
    public ResponseEntity<String> printDocument(@PathVariable String reference) {
        try {
            documentService.printDocument(reference);
            return ResponseEntity.ok("Document envoyé à l'imprimante avec succès");

        } catch (RuntimeException e) {
            if (e.getMessage().contains("Document non trouvé")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Document non trouvé");
            } else if (e.getMessage().contains("Aucune pièce jointe")) {
                return ResponseEntity.badRequest().body("Aucune pièce jointe à imprimer");
            } else if (e.getMessage().contains("Aucune imprimante")) {
                return ResponseEntity.badRequest().body("Aucune imprimante par défaut trouvée");
            }
            return ResponseEntity.internalServerError().body("Erreur lors de l'impression: " + e.getMessage());

        } catch (PrintException e) {
            return ResponseEntity.internalServerError().body("Erreur d'impression: " + e.getMessage());

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Erreur de lecture du fichier: " + e.getMessage());
        }
    }

    @DeleteMapping("/{reference}")
    public ResponseEntity<?> deleteDocument(@PathVariable String reference) {
        boolean deleted = documentService.deleteDocument(reference);
        return deleted ? ResponseEntity.ok(Map.of("delete", "Document Supprimer avec succes  "))
                : ResponseEntity.notFound().build();
    }

    @GetMapping("/historique")
    public ResponseEntity<List<DocumentHistoriqueDto>> getDocumentHistorique() {
        List<DocumentHistoriqueDto> documents = documentService.getAllDocumentsSorted()
                .stream()
                .map(doc -> new DocumentHistoriqueDto(
                        doc.getReference(),
                        doc.getObjet(),
                        doc.getCorps(),
                        doc.getType(),
                        doc.getStatus(),
                        doc.getCreator().getMatricule(),
                        doc.getCreator().getUsername(),
                        doc.getCreator().getSurname(),
                        doc.getCreatedAt()))
                .toList();
        return ResponseEntity.ok(documents);
    }

}