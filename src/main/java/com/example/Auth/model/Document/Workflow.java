package com.example.Auth.model.Document;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.example.Auth.model.User.User;
import com.example.Auth.model.User.ServiceDfcr;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "workflow")
@Getter
@Setter
public class Workflow {

    @Id
    @Column(name = "id_workflow")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idWorkflow;

    @Column(name = "type_workflow", nullable = false)
    private String typeWorkflow;

    @Column(nullable = false)
    private String action;

    @Column(nullable = false)
    private String status;

    @ManyToOne
    @JoinColumn(name = "reference", nullable = false)
    private Document document;

    @ManyToOne
    @JoinColumn(name = "acteur_matricule")
    private User acteur;

    @ManyToOne
    @JoinColumn(name = "destinataire_matricule")
    private User destinataire;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private ServiceDfcr service;

    @Column(length = 1000)
    private String remarque;

    @Column(name = "est_complet")
    private Boolean estComplet;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Workflow() {
    }

    public Workflow(String typeWorkflow, String action, String status, Document document) {
        this.typeWorkflow = typeWorkflow;
        this.action = action;
        this.status = status;
        this.document = document;
    }
}