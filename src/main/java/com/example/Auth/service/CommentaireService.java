package com.example.Auth.service;

import com.example.Auth.dto.CommentaireDto;
import com.example.Auth.model.Commentaire;
import com.example.Auth.model.Document;
import com.example.Auth.model.User;
import com.example.Auth.repository.CommentaireRepository;
import com.example.Auth.repository.DocumentRepository;
import com.example.Auth.repository.UserRepository;
import com.example.Auth.utils.LoggerService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.UUID;

@Service
public class CommentaireService {
    private final CommentaireRepository commentaireRepository;
    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;
    private final LoggerService log;

    public CommentaireService(CommentaireRepository commentaireRepository, UserRepository userRepository,
            DocumentRepository documentRepository, LoggerService log) {
        this.commentaireRepository = commentaireRepository;
        this.userRepository = userRepository;
        this.documentRepository = documentRepository;
        this.log = log;
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Utilisateur non authentifié");
        }

        log.info("Utilisateur actuel : " + authentication.getName());
        String matricule = authentication.getName();

        return userRepository.findByMatricule(matricule)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec matricule : " + matricule));
    }

    private Document getDocumentByReference(String reference) {
        return documentRepository.findById(reference)
                .orElseThrow(
                        () -> new RuntimeException("Document non trouvé avec id : " + reference));
    }

    public List<Commentaire> getAllCommentaires() {
        return commentaireRepository.findAll();
    }

    public Commentaire createCommentaire(CommentaireDto input) {
        User currentUser = getCurrentUser();
        log.info("Création du commentaire pour l'utilisateur : " + currentUser.getMatricule());
        Document document = getDocumentByReference(input.getReferenceDocument());
        log.info("Document trouvé : " + document.getReference());

        Commentaire commentaire = new Commentaire();
        commentaire.setContenuCommentaire(input.getContenuCommentaire());
        commentaire.setUser(currentUser);
        commentaire.setDocument(document);

        return commentaireRepository.save(commentaire);
    }

}
