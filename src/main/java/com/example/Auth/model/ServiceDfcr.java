package com.example.Auth.model;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@Table(name = "service")
public class ServiceDfcr {
    @Id
    @Column(name = "id_service")
    private String idService;
    @Column(name = "nom_service", nullable = false)
    private String serviceName;
    private String attribution;
    @Column(name = "email_service", nullable = false)
    private String serviceEmail;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL)
    private List<User> users;

    public ServiceDfcr(String idService, String serviceName, String attribution, String serviceEmail) {
        this.idService = idService;
        this.serviceName = serviceName;
        this.attribution = attribution;
        this.serviceEmail = serviceEmail;
    }

    public ServiceDfcr() {

    }

}
