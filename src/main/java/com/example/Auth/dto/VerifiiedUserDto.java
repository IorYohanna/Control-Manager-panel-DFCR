package com.example.Auth.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class VerifiiedUserDto {
    private String matricule;
    private String verificationCode;
}
