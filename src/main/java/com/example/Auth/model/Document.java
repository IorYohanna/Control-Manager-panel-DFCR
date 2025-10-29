package com.example.Auth.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import lombok.Getter;
import lombok.Setter;

@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name = "documents")
@Getter
@Setter
public class Document {
    @Id
    private String reference;
    private String objet;
    private String corps;
    @Column(nullable = false)
    private String type;
    @Column(nullable = false)
    private String status;
    @Column(name = "piece_jointe", columnDefinition = "bytea")
    private byte[] pieceJointe;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL)
    private List<Commentaire> commentaires;


    public Document(String reference, String objet, String corps,
            String type, String status, byte[] pieceJointe) {
        this.reference = reference;
        this.objet = objet;
        this.corps = corps;
        this.type = type;
        this.status = status;
        this.pieceJointe = pieceJointe;
    }

    public Document() {
    }

}
