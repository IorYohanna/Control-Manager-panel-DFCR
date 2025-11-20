package com.example.Auth.service.Document;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.Auth.dto.Document.DossierDto;
import com.example.Auth.model.Document.Concerner;
import com.example.Auth.model.Document.Document;
import com.example.Auth.model.Document.Dossier;
import com.example.Auth.repository.Document.DocumentRepository;
import com.example.Auth.repository.Document.DossierRepository;
import com.example.Auth.repository.Document.ConcernerRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class DossierService {

    private final DossierRepository dossierRepository;
    private final ConcernerRepository concernerRepository;
    private final DocumentRepository documentRepository;

    public Dossier createDossier(DossierDto input) {
        Dossier dossier = new Dossier(input.getTitle());
        dossierRepository.save(dossier);

        if (input.getDocumentReferences() != null) {
            for (String ref : input.getDocumentReferences()) {
                Document doc = documentRepository.findById(ref)
                        .orElseThrow(() -> new RuntimeException("Document introuvable: " + ref));

                Concerner c = new Concerner(dossier, doc);
                concernerRepository.save(c);
            }
        }

        return dossier;
    }

    public void addDocumentToDossier(Long dossierId, String documentRef) {
        Dossier dossier = dossierRepository.findById(dossierId)
                .orElseThrow(() -> new RuntimeException("Dossier non trouvé: " + dossierId));

        Document document = documentRepository.findById(documentRef)
                .orElseThrow(() -> new RuntimeException("Document introuvable: " + documentRef));

        boolean exists = concernerRepository.existsByDossierAndDocument(dossier, document);
        if (exists)
            throw new RuntimeException("Document déjà présent dans ce dossier.");

        Concerner c = new Concerner(dossier, document);
        concernerRepository.save(c);
    }

    public List<Dossier> getAllDossiers() {
        return dossierRepository.findAll();
    }

    public List<Document> getDocumentsByDossier(Long idDossier) {
        Dossier dossier = dossierRepository.findById(idDossier)
                .orElseThrow(() -> new RuntimeException("Dossier introuvable"));

        return dossier.getDocuments()
                .stream()
                .map(Concerner::getDocument)
                .toList();
    }

    public Optional<Dossier> getDossierById(Long id) {
        return dossierRepository.findById(id);
    }

    public Dossier updateDossier(Long id, DossierDto input) {
        Dossier dossier = dossierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dossier non trouvé avec ID : " + id));

        dossier.setTitle(input.getTitle());

        return dossierRepository.save(dossier);
    }

    public void deleteDossier(Long id) {
        Dossier dossier = dossierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dossier introuvable avec l'ID : " + id));

        dossierRepository.delete(dossier);
    }
}
