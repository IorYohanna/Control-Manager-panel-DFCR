package com.example.Auth.model.workflow;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.example.Auth.model.User.User;
import com.example.Auth.model.Document.Document;
import com.example.Auth.model.User.ServiceDfcr;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "workflow_historique")
@Getter
@Setter
public class WorkflowHistorique {

    @Id
    @Column(name = "id_historique")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idHistorique;

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
    @JoinColumn(name = "id_service")
    private ServiceDfcr service;

    @Column(length = 1000)
    private String remarque;

    @Column(name = "est_complet")
    private Boolean estComplet;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public WorkflowHistorique() {
    }

    // Constructeur pour créer un historique à partir d'un Workflow
    public WorkflowHistorique(Workflow workflow) {
        this.typeWorkflow = workflow.getTypeWorkflow();
        this.action = workflow.getAction();
        this.status = workflow.getStatus();
        this.document = workflow.getDocument();
        this.acteur = workflow.getActeur();
        this.destinataire = workflow.getDestinataire();
        this.service = workflow.getService();
        this.remarque = workflow.getRemarque();
        this.estComplet = workflow.getEstComplet();
    }
}