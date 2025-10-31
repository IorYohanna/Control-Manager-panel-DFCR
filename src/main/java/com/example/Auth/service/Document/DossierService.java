package com.example.Auth.service.Document;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.Auth.dto.Document.DossierDto;
import com.example.Auth.model.Document.Dossier;
import com.example.Auth.repository.Document.DossierRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class DossierService {

    private final DossierRepository dossierRepository;

    public Dossier createDossier(DossierDto input) {
        Dossier dossier = new Dossier(input.getTitle());
        return dossierRepository.save(dossier);
    }

    public List<Dossier> getAllDossiers() {
        return dossierRepository.findAll();
    }

    public Optional<Dossier> getDossierById(Long id) {
       return dossierRepository.findById(id);
    }

    public Dossier updateDossier(Long id, DossierDto input) {
        Optional<Dossier> dossierOpt = dossierRepository.findById(id);
        if(dossierOpt.isEmpty()) {
            throw new RuntimeException("dossier non trouver avec id" + id);
        }

        Dossier dossier = dossierOpt.get();
        dossier.setTitle(input.getTitle());
        return dossierRepository.save(dossier);

    }

    public void deleteDossier(Long id) {
        Dossier dossier = dossierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dossier introuvable avec l'id : " + id));
        dossierRepository.delete(dossier);
    }
}
