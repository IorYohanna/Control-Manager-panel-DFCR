package com.example.Auth.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Workflow(String typeWorkflow, String action, String status) {
        this.typeWorkflow = typeWorkflow;
        this.action = action;
        this.status = status;
    }

    public Workflow() {

    }

}
