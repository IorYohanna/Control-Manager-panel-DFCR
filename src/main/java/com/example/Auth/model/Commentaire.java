package com.example.Auth.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
@Table(name = "commentaires")
public class Commentaire {
    @Id
    @Column(name = "id_commentaire")
    private String idCommentaire;
    @Column(name = "contenu_commentaire", nullable = false)
    private String contenuCommentaire;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "matricule", referencedColumnName = "matricule", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reference", referencedColumnName = "reference", nullable = false)
    private Document document;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Commentaire() {
    }

    public Commentaire(String idCommentaire, String contenuCommentaire, User user, Document document) {
        this.idCommentaire = idCommentaire;
        this.contenuCommentaire = contenuCommentaire;
        this.user = user;
        this.document = document;
    }

}
