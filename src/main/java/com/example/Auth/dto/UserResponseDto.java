package com.example.Auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserResponseDto {
    private String matricule;
    private String username;
    private String surname;
    private String email;
    private String fonction;
    private String contact;
    private String idService;
    private boolean enabled;
}
