package com.example.Auth.dto.Security;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterUSerDto {
    private String matricule;
    private String username;
    private String surname;
    private String password;
    private String email;
    private String fonction;
    private String contact;
    private String idService;
}