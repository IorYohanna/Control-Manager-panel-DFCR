package com.example.Auth.dto.Document;

import java.util.Base64;

import com.example.Auth.model.Document.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DocumentResponseDto {
    private String reference;
    private String objet;
    private String corps;
    private String type;
    private String status;
    private String creatorMatricule;
    private String creatorName;
    private String creatorEmail;


}
