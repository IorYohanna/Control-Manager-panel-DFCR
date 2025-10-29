package com.example.Auth.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.Auth.model.Dossier;
import com.example.Auth.repository.DossierRepository;

@Service
//permet de rollbacker en cas de probleme
@Transactional
public class DossierService {

    private final DossierRepository dossierRepository;

    public DossierService(DossierRepository dossierRepository) {
        this.dossierRepository = dossierRepository;
    }

    public Dossier createDossier(Dossier dossier) {
        return dossierRepository.save(dossier);
    }

    public List<Dossier> getAllDossiers() {
        return dossierRepository.findAll();
    }

    public Optional<Dossier> getDossierById(Long id) {
        return dossierRepository.findById(id);
    }

    public Dossier updateDossier(Long id, Dossier updatedDossier) {
        return dossierRepository.findById(id).map(d -> {
            d.setTitle(updatedDossier.getTitle());
            return dossierRepository.save(d);
        }).orElseThrow(() -> new RuntimeException("Dossier non trouvé avec l'id " + id));
    }

    public void deleteDossier(Long id) {
        dossierRepository.deleteById(id);
    }
}
