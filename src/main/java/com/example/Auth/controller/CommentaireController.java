package com.example.Auth.controller;

import com.example.Auth.dto.CommentaireDto;
import com.example.Auth.model.Commentaire;
import com.example.Auth.service.CommentaireService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/commentaires")
public class CommentaireController {
    private final CommentaireService commentaireService;

    public CommentaireController(CommentaireService commentaireService) {
        this.commentaireService = commentaireService;
    }

    @PostMapping
    public ResponseEntity<?> createCommentaire(@RequestBody CommentaireDto input) {
        if (input.getContenuCommentaire() == null || input.getContenuCommentaire().isBlank()) {
            return ResponseEntity.badRequest().body("Le contenu du commentaire est vide");
        }

        Commentaire created = commentaireService.createCommentaire(input);
        CommentaireDto responseDto = new CommentaireDto(created.getContenuCommentaire(), created.getDocument().getReference());
        return ResponseEntity.status(201).body(responseDto);
    }
}
