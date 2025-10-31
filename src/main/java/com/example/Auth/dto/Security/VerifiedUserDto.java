package com.example.Auth.dto.Security;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class VerifiedUserDto {
    private String matricule;
    private String verificationCode;
}
