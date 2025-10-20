package com.example.dfcr.repositories;

import com.example.dfcr.models.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<Utilisateur, String>{
    Optional<Utilisateur> findByMatricule(String matricule);
}
