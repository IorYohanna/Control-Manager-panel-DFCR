package com.example.Auth.repository.Document;

import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import com.example.Auth.model.Document.Commentaire;

@Repository
public interface CommentaireRepository extends ListCrudRepository<Commentaire, Long> {

}
