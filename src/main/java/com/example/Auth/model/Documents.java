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
public class Documents {
    @Id
    private String reference;
    @Column(name = "libelle", nullable = true)
    private String libelle;
    @Column(name = "objet")
    private String objet;
    @Column(name = "corps")
    private String corps;
    @Column(name = "type", nullable = true)
    private String type;
    @Column(name = "status", nullable = true)
    private String status;

    @Column(name = "date_creation", nullable = true)
    private LocalDate dateCreation;
    @Column(name = "piece_jointe")
    @Lob
    private byte[] pieceJointe;

    public Documents(String reference, String libelle, String objet, String corps,
            String type, String status, LocalDate dateCreation, byte[] pieceJointe) {
        this.reference = reference;
        this.libelle = libelle;
        this.objet = objet;
        this.corps = corps;
        this.type = type;
        this.status = status;
        this.dateCreation = dateCreation;
        this.pieceJointe = pieceJointe;
    }

    public Documents() {
    }

}
