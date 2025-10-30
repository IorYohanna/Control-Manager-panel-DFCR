package com.example.Auth.model;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "utilisateurs")
@Getter
@Setter
public class User implements UserDetails {

    @Id
    private String matricule;
    @Column(name = "nom_utilisateur")
    private String username;
    @Column(name = "prenom_utilisateur", nullable = true)
    private String surname;
    @Column(unique = true, nullable = false)
    private String email;
    @Column(name = "password", nullable = false)
    private String password;
    @Column(nullable = false)
    private String fonction;
    private Integer contact;

    @ManyToOne
    @JoinColumn(name = "id_service", nullable = false)
    private ServiceDfcr service;

    private Integer score;
    private String evaluation;
    @Column(name = "date_evaluation")
    private Date dateEvaluation;

    private boolean enabled;
    @Column(name = "verification_code")
    private String verificationCode;
    @Column(name = "verification_expired")
    private LocalDateTime verificationExpireAt;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Commentaire> commentaires;

    @OneToMany(mappedBy = "createdBy", cascade = CascadeType.ALL)
    private List<Event> events;

    public User(String matricule, String surname, String username, String password, String email, String fonction,
            String contact, ServiceDfcr service) {
        this.matricule = matricule;
        this.username = username;
        this.surname = surname;
        this.password = password;
        this.fonction = fonction;
        this.email = email;
        this.contact = Integer.valueOf(contact);
        this.service = service;
    }

    public User() {
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + fonction));
    }

    @Override
    public String getUsername() {
        return matricule;
    };

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

}
