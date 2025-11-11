package com.example.Auth.dto.Workflow;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChefActionRequest {
    private String reference;
    private String chefMatricule;
    private String directeurMatricule; // Pour validation
    private String employeMatricule; // Pour refus
    private String remarque;
}