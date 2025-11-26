package com.example.Auth.service.Document;

import com.example.Auth.dto.Document.DocumentDto;
import com.example.Auth.model.Document.Document;
import com.example.Auth.model.User.User;
import com.example.Auth.model.workflow.Workflow;
import com.example.Auth.repository.Document.DocumentRepository;
import com.example.Auth.repository.User.UserRepository;
import com.example.Auth.repository.workflow.WorkflowRepository;
import com.example.Auth.service.Security.CurrentUserService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.Auth.utils.FileUtilsService;
import com.example.Auth.utils.LoggerService;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import javax.print.Doc;
import javax.print.DocFlavor;
import javax.print.DocPrintJob;
import javax.print.PrintException;
import javax.print.PrintService;
import javax.print.PrintServiceLookup;
import javax.print.SimpleDoc;
import javax.print.attribute.HashPrintRequestAttributeSet;
import javax.print.attribute.PrintRequestAttributeSet;
import javax.print.attribute.standard.Copies;
import javax.print.attribute.standard.MediaSizeName;

@Service
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final WorkflowRepository workflowRepository;
    private final UserRepository userRepository;
    private final FileUtilsService fileUtilsService;
    private final CurrentUserService currentUserService;
    private final LoggerService log;

    public DocumentService(DocumentRepository documentRepository, WorkflowRepository workflowRepository,
            UserRepository userRepository, FileUtilsService fileUtilsService, CurrentUserService currentUserService,
            LoggerService log) {
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
        this.workflowRepository = workflowRepository;
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
            MultipartFile pieceJointe,
            String deadline) throws IOException {

        User creator = userRepository.findByMatricule(currentUserService.getMatricule())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        if (documentRepository.findById(reference).isPresent()) {
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
        doc.setDeadline(LocalDateTime.parse(deadline));

        Document savedDoc = documentRepository.save(doc);

        User directeur = getDirecteur();

        Workflow workflow = new Workflow();
        workflow.setDocument(savedDoc);
        workflow.setTypeWorkflow("RECEPTION");
        workflow.setAction("RECEVOIR");
        workflow.setStatus("en_attente");
        workflow.setDestinataire(directeur);
        workflow.setRemarque("Document créé et en attente de traitement");

        workflowRepository.save(workflow);

        return savedDoc;
    }

    private User getDirecteur() {
        return userRepository.findByFonction("Directeur")
                .orElseThrow(() -> new RuntimeException("Aucun directeur trouvé"));
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
            existingDocument.setDeadline(input.getDeadline());

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

        MediaType mediaType = getMediaTypeForFileType(doc.getType());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(mediaType)
                .contentLength(fileData.length)
                .body(fileData);
    }

    private MediaType getMediaTypeForFileType(String fileType) {
        if (fileType == null) {
            return MediaType.APPLICATION_OCTET_STREAM;
        }

        return switch (fileType.toLowerCase()) {
            case "pdf" -> MediaType.APPLICATION_PDF;
            case "jpg", "jpeg" -> MediaType.IMAGE_JPEG;
            case "png" -> MediaType.IMAGE_PNG;
            case "gif" -> MediaType.IMAGE_GIF;
            case "txt" -> MediaType.TEXT_PLAIN;
            case "doc" -> MediaType.valueOf("application/msword");
            case "docx" -> MediaType.valueOf("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            case "xls" -> MediaType.valueOf("application/vnd.ms-excel");
            case "xlsx" -> MediaType.valueOf("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            default -> MediaType.APPLICATION_OCTET_STREAM;
        };
    }

    public void printDocument(String reference) throws IOException, PrintException {
        Optional<Document> docOpt = documentRepository.findById(reference);

        if (docOpt.isEmpty()) {
            throw new RuntimeException("Document non trouvé");
        }

        Document doc = docOpt.get();
        byte[] fileData = doc.getPieceJointe();

        if (fileData == null || fileData.length == 0) {
            throw new RuntimeException("Aucune pièce jointe à imprimer");
        }

        InputStream inputStream = new ByteArrayInputStream(fileData);

        DocFlavor flavor;
        switch (doc.getType().toLowerCase()) {
            case "pdf":
                flavor = DocFlavor.INPUT_STREAM.PDF;
                break;
            case "txt":
                flavor = DocFlavor.INPUT_STREAM.TEXT_PLAIN_UTF_8;
                break;
            case "jpg":
            case "jpeg":
                flavor = DocFlavor.INPUT_STREAM.JPEG;
                break;
            case "png":
                flavor = DocFlavor.INPUT_STREAM.PNG;
                break;
            default:
                flavor = DocFlavor.INPUT_STREAM.AUTOSENSE;
                break;
        }

        Doc docToPrint = new SimpleDoc(inputStream, flavor, null);

        PrintRequestAttributeSet pras = new HashPrintRequestAttributeSet();
        pras.add(new Copies(1));
        pras.add(MediaSizeName.ISO_A4);

        PrintService printService = PrintServiceLookup.lookupDefaultPrintService();
        if (printService == null) {
            throw new RuntimeException("Aucune imprimante par défaut trouvée");
        }

        DocPrintJob job = printService.createPrintJob();
        job.print(docToPrint, pras);

        log.success("Document imprimé avec succès : " + doc.getReference());
    }

    public List<Document> searchByKeyword(String keyword) {
        return documentRepository.searchByKeyword(keyword);
    }

    public List<Document> findByType(String type) {
        return documentRepository.findByType(type);
    }

    public Document getDocumentAvecWorkflows(String reference) {
        return documentRepository.findById(reference)
                .orElseThrow(() -> new RuntimeException("Document non trouvé"));
    }

    public List<Document> getAllDocumentsSorted() {
        return documentRepository.findAllByOrderByCreatedAtDesc();
    }

    public Document updatePieceJointe(String reference, MultipartFile pieceJointe) throws IOException {
        Optional<Document> existingDocumentOpt = documentRepository.findById(reference);

        log.info("Mise à jour de la pièce jointe du document: " + reference);

        if (existingDocumentOpt.isPresent()) {
            Document existingDocument = existingDocumentOpt.get();

            if (pieceJointe == null || pieceJointe.isEmpty()) {
                log.error("Fichier vide ou null", null);
                throw new RuntimeException("Le fichier ne peut pas être vide");
            }

            existingDocument.setPieceJointe(fileUtilsService.convertToBytes(pieceJointe));

            String contentType = pieceJointe.getContentType();
            if (contentType != null) {
                String fileExtension = getFileExtension(contentType);
                if (fileExtension != null && !fileExtension.isEmpty()) {
                    existingDocument.setType(fileExtension);
                }
            }

            Document updatedDocument = documentRepository.save(existingDocument);
            log.success("Pièce jointe mise à jour avec succès pour le document: " + reference);
            return updatedDocument;
        }

        log.error("Document non trouvé: " + reference, null);
        throw new RuntimeException("Document non trouvé avec la référence: " + reference);
    }

    private String getFileExtension(String contentType) {
        return switch (contentType.toLowerCase()) {
            case "application/pdf" -> "pdf";
            case "image/jpeg" -> "jpg";
            case "image/png" -> "png";
            case "image/gif" -> "gif";
            case "text/plain" -> "txt";
            case "application/msword" -> "doc";
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document" -> "docx";
            case "application/vnd.ms-excel" -> "xls";
            case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" -> "xlsx";
            default -> null;
        };
    }
}
