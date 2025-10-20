package com.example.dfcr.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UtilisateurResponse {
    String matricule;
    String nomUtilisateur;
    String prenomUtilisateur;
    String fonction;
    Integer contact;
    String email;
    Integer idService;
    Integer idPefa;
    List<String> roles;
}
