package com.example.Auth.dto.Document;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DocumentDto {
    private String reference;
    private String objet;
    private String corps;
    private String type;
    private String status;
    private byte[] pieceJointe;
}
