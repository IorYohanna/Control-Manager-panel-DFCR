package com.example.Auth.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Auth.dto.DossierDto;
import com.example.Auth.model.Dossier;
import com.example.Auth.service.DossierService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/dossiers")
@RequiredArgsConstructor
public class DossierController {

    private final DossierService dossierService;

    @PostMapping
    public ResponseEntity<Dossier> createDossier(@RequestBody DossierDto dto) {
        return ResponseEntity.ok(dossierService.createDossier(dto));
    }

    @GetMapping
    public ResponseEntity<List<Dossier>> getAllDossiers() {
        return ResponseEntity.ok(dossierService.getAllDossiers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Dossier>> getDossier(@PathVariable Long id) {
        return ResponseEntity.ok(dossierService.getDossierById(id));
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
}
