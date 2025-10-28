package com.example.Auth.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

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

    @Column(name = "date_creation", nullable = false)
    private LocalDate dateCreation;
    @Column(name = "piece_jointe", columnDefinition = "bytea")
    private byte[] pieceJointe;

    public Document(String reference, String objet, String corps,
            String type, String status, LocalDate dateCreation, byte[] pieceJointe) {
        this.reference = reference;
        this.objet = objet;
        this.corps = corps;
        this.type = type;
        this.status = status;
        this.dateCreation = dateCreation;
        this.pieceJointe = pieceJointe;
    }

    public Document() {
    }

}
