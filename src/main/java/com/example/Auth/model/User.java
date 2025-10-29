package com.example.Auth.model;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
/* import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType; */
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
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
    @Column(name = "id_service", nullable = false)
    private String idService;
    @Column(name = "id_pefa")
    private Integer idPefa;

    private Integer score;
    private String evaluation;
    @Column(name = "date_evaluation")
    private Date dateEvaluation;

    private boolean enabled;
    @Column(name = "verification_code")
    private String verificationCode;
    @Column(name = "verification_expired")
    private LocalDateTime verificationExpireAt;

    public User(String matricule, String surname, String username, String password, String email, String fonction,
            String contact, String idService) {
        this.matricule = matricule;
        this.username = username;
        this.surname = surname;
        this.password = password;
        this.fonction = fonction;
        this.email = email;
        this.contact = Integer.valueOf(contact);
        this.idService = idService;
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
