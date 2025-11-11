package com.example.Auth.dto.Workflow;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * DTO pour l'envoi d'un document au service par le directeur
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SendToServiceRequest {
    private String reference;
    private String directeurMatricule;
    private String serviceId;
    private String typeWorkflow; // "POUR_ACTION" ou "POUR_SUIVI"
    private String remarque;
}