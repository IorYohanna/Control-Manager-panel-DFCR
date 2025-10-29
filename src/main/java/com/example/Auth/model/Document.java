package com.example.Auth.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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

    public Document(String reference, String objet, String corps,
            String type, String status, LocalDate dateCreation, byte[] pieceJointe) {
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
