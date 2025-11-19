package com.example.Auth.dto.Document;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DossierDto {
    private String title;
    private List<String> documentReferences; 
}

