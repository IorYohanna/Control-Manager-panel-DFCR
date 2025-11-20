package com.example.Auth.dto.Document;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class DossierResponseDto {
    private Long idDossier;
    private String title;
    private LocalDateTime createdAt;
    private int documentCount;

}
