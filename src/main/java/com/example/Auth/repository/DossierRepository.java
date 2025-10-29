package com.example.Auth.repository;

import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import com.example.Auth.model.Dossier;

@Repository
public interface DossierRepository extends ListCrudRepository<Dossier,Long> {

    
}