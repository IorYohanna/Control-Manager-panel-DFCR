package com.example.Auth.dto.Notification;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {

    // Pour envoyer à des utilisateurs spécifiques (par matricule)
    private List<String> userIds; // Ex: ["EMP001", "EMP002", "EMP003"]

    // Pour envoyer à une fonction
    private String fonction; // Ex: "Chef de service", "Directeur", "Employé"

    // Pour envoyer à un service
    private String idService; // Ex: "SRV001", "SRV002"

    // Contenu de la notification
    private String type;    // Type de notification (ASSIGNATION, MEETING_SCHEDULED, etc.)
    private String message; // Message à afficher
}