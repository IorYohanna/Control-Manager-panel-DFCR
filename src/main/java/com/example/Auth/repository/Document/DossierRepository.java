package com.example.Auth.repository.Document;

import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import com.example.Auth.model.Document.Dossier;

@Repository
public interface DossierRepository extends ListCrudRepository<Dossier,Long> {

    
}