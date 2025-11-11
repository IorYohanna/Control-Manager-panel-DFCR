package com.example.Auth.dto.Dashboard;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserInfoDto {
    private String matricule;
    private String username;
    private String surname;
    private String fonction;
    private byte[] photoProfil;
}
