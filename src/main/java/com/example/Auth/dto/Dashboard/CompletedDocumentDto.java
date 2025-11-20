package com.example.Auth.dto.Dashboard;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class CompletedDocumentDto {
    private String reference;
    private String objet;
    private String corps;
    private String type;
    private String status;
    private String creatorMatricule;
    private String creatorName;
    private String creatorEmail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
