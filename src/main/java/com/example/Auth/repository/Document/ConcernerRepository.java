package com.example.Auth.repository.Document;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Auth.model.Document.Concerner;
import com.example.Auth.model.Document.Document;
import com.example.Auth.model.Document.Dossier;

@Repository
public interface ConcernerRepository extends JpaRepository<Concerner, Long> {
    boolean existsByDossierAndDocument(Dossier dossier, Document document);
}
