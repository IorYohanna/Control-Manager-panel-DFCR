package com.example.Auth.dto.Workflow;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

/**
 * DTO pour l'envoi d'un document à un ou plusieurs services par le directeur
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SendToServiceRequest {
    private String reference;
    private String directeurMatricule;

    // Pour la compatibilité avec l'ancien code (single service)
    private String serviceId;

    // Pour la nouvelle fonctionnalité (multiple services)
    @JsonProperty("serviceIds")
    private List<String> serviceIds;

    private String typeWorkflow;
    private String remarque;

    /**
     * Méthode helper pour obtenir les IDs de services
     * Gère à la fois le cas single et multiple
     */
    public List<String> getServiceIdsAsList() {
        if (serviceIds != null && !serviceIds.isEmpty()) {
            return serviceIds;
        }
        if (serviceId != null && !serviceId.isEmpty()) {
            return List.of(serviceId);
        }
        return List.of();
    }
}