package com.example.dfcr.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "utilisateur")
public class Utilisateur implements UserDetails{
    @Id
    private String matricule;
    @Column(name = "nom_utilisateur")
    private String nomUtilisateur;

    @Column(name = "prenom_utilisateur")
    private String prenomUtilisateur;

    @Column(name = "mot_de_passe")
    private String motDePasse;

    private String fonction;
    private Integer contact;
    private String email;

    @Column(name = "id_service")
    private Integer idService;

    @Column(name = "id_pefa")
    private Integer idPefa;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + fonction));
    }

    @Override
    public String getPassword() {
        return motDePasse;
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
        return true;
    }
}
