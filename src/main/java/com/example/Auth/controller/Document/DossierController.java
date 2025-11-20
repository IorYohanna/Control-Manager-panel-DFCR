package com.example.Auth.controller.Document;

import java.util.List;
import java.util.Optional;

import com.example.Auth.dto.Document.DocumentResponseDto;
import com.example.Auth.dto.Document.DossierResponseDto;
import com.example.Auth.model.Document.Document;
import lombok.Getter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Auth.dto.Document.DossierDto;
import com.example.Auth.model.Document.Dossier;
import com.example.Auth.service.Document.DossierService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/dossiers")
@RequiredArgsConstructor
public class DossierController {

    private final DossierService dossierService;

    @PostMapping
    public ResponseEntity<Dossier> createDossier(@RequestBody DossierDto dto) {
        return ResponseEntity.ok(dossierService.createDossier(dto));
    }

//    @GetMapping
//    public ResponseEntity<List<Dossier>> getAllDossiers() {
//        return ResponseEntity.ok(dossierService.getAllDossiers());
//    }

    @GetMapping
    public ResponseEntity<List<DossierResponseDto>> getAllDossiers(){
        List<Dossier> dossiers = dossierService.getAllDossiers();
        List<DossierResponseDto> dossierResponseDtos = dossiers.stream().map(dossier -> {
            DossierResponseDto dto = new DossierResponseDto();
            dto.setIdDossier(dossier.getIdDossier());
            dto.setTitle(dossier.getTitle());
            dto.setCreatedAt(dossier.getCreatedAt());
            dto.setDocumentCount(dossier.getDocuments() != null ? dossier.getDocuments().size() : 0);
            return dto;
        }).toList();

        return ResponseEntity.ok(dossierResponseDtos);
    }

//    @GetMapping("/{id}")
//    public ResponseEntity<Optional<Dossier>> getDossier(@PathVariable Long id) {
//        return ResponseEntity.ok(dossierService.getDossierById(id));
//    }

    @GetMapping("/{id}")
    public ResponseEntity<DossierResponseDto> getDossier (@PathVariable Long id) {
        Dossier dossier = dossierService.getDossierById(id)
                .orElseThrow(() -> new RuntimeException("Dossier non trouvé avec id : " + id));
        DossierResponseDto dto = new DossierResponseDto();
        dto.setIdDossier(dossier.getIdDossier());
        dto.setTitle(dossier.getTitle());
        dto.setCreatedAt(dossier.getCreatedAt());
        dto.setDocumentCount(dossier.getDocuments() != null ? dossier.getDocuments().size() : 0);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{id}/documents")
    public ResponseEntity<List<DocumentResponseDto>> getAllDocumentsInDossier(@PathVariable Long id) {

        List<Document> documents = dossierService.getDocumentsByDossier(id);

        List<DocumentResponseDto> response = documents.stream()
                .map(doc -> new DocumentResponseDto(
                        doc.getReference(),
                        doc.getObjet(),
                        doc.getCorps(),
                        doc.getType(),
                        doc.getStatus(),
                        doc.getCreator().getMatricule(),
                        doc.getCreator().getUsername(),
                        doc.getCreator().getSurname()
                ))
                .toList();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Dossier> updateDossier(@PathVariable Long id, @RequestBody DossierDto dto) {
        return ResponseEntity.ok(dossierService.updateDossier(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDossier(@PathVariable Long id) {
        dossierService.deleteDossier(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/add-document/{reference}")
    public ResponseEntity<String> addDocumentDossier(@PathVariable Long id , @PathVariable String reference) {
        //TODO: process POST request
        dossierService.addDocumentToDossier(id, reference);
        return ResponseEntity.ok("Document ajouter au dossier");
    }
    
}
