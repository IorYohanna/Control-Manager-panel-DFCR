package com.example.Auth.dto.Workflow;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DirecteurActionRequest {
    private String reference;
    private String directeurMatricule;
    private String serviceId; // Pour le refus (renvoyer au service)
    private String remarque;
}
