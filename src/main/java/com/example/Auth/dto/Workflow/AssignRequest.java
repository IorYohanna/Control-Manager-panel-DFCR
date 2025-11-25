package com.example.Auth.dto.Workflow;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

/**
 * DTO pour l'assignation d'un document à un ou plusieurs employés par le chef
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AssignRequest {
    private String reference;
    private String chefMatricule;
    
    // Pour la compatibilité avec l'ancien code (single employé)
    private String employeMatricule;
    
    // Pour la nouvelle fonctionnalité (multiple employés)
    @JsonProperty("employeMatricules")
    private List<String> employeMatricules;
    
    private String remarque;
    
    /**
     * Méthode helper pour obtenir les matricules des employés
     * Gère à la fois le cas single et multiple
     */
    public List<String> getEmployeMatriculesAsList() {
        if (employeMatricules != null && !employeMatricules.isEmpty()) {
            return employeMatricules;
        }
        if (employeMatricule != null && !employeMatricule.isEmpty()) {
            return List.of(employeMatricule);
        }
        return List.of();
    }
}