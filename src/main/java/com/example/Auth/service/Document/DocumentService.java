package com.example.Auth.service.Document;

import com.example.Auth.dto.Document.DocumentDto;
import com.example.Auth.model.Document.Document;
import com.example.Auth.model.User.User;
import com.example.Auth.repository.Document.DocumentRepository;

import com.example.Auth.repository.User.UserRepository;
import com.example.Auth.service.Security.CurrentUserService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.Auth.utils.FileUtilsService;
import com.example.Auth.utils.LoggerService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final FileUtilsService fileUtilsService;
    private final CurrentUserService currentUserService;
    private final LoggerService log;

    public DocumentService(DocumentRepository documentRepository, UserRepository userRepository, FileUtilsService fileUtilsService, CurrentUserService currentUserService,
                           LoggerService log) {
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
        this.fileUtilsService = fileUtilsService;
        this.currentUserService = currentUserService;
        this.log = log;
    }

    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    public Optional<Document> getDocumentByReference(String reference) {
        return documentRepository.findById(reference);
    }

    public Document createDocument(
            String reference,
            String objet,
            String corps,
            String type,
            String status,
            MultipartFile pieceJointe) throws IOException {

        User creator = userRepository.findByMatricule(currentUserService.getMatricule())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        if(documentRepository.findById(reference).isPresent()){
            throw new RuntimeException("Document avec cette référence existe déjà");
        }

        Document doc = new Document();
        doc.setReference(reference);
        doc.setObjet(objet);
        doc.setCorps(corps);
        doc.setType(type);
        doc.setStatus(status);
        doc.setPieceJointe(fileUtilsService.convertToBytes(pieceJointe));
        doc.setCreator(creator);

        return documentRepository.save(doc);
    }

    public Document updateDocument(String reference, DocumentDto input) {

        Optional<Document> existingDocumentOpt = documentRepository.findById(reference);

        log.info("Mise à jour du documents");

        if (existingDocumentOpt.isPresent()) {
            Document existingDocument = existingDocumentOpt.get();
            existingDocument.setObjet(input.getObjet());
            existingDocument.setCorps(input.getCorps());
            existingDocument.setType(input.getType());
            existingDocument.setStatus(input.getStatus());
            existingDocument.setPieceJointe(input.getPieceJointe());

            log.success("Mise à jour réussi!!");
            return documentRepository.save(existingDocument);
        }
        log.error("Mise à jour échoué", null);
        return null;
    }

    public boolean deleteDocument(String reference) {
        Optional<Document> document = documentRepository.findById(reference);
        if (document.isPresent()) {
            documentRepository.deleteById(reference);
            log.success("Suppression réussi");
            return true;
        }
        return false;
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

    public List<Document> searchByKeyword(String keyword) {
        return documentRepository.searchByKeyword(keyword);
    }

    public List<Document> findByType(String type) {
        return documentRepository.findByType(type);
    }

}
