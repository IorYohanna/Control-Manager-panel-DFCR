package com.example.Auth.repository;

import com.example.Auth.model.Commentaire;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentaireRepository extends ListCrudRepository<Commentaire, String> {

}
