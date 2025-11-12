package com.example.Auth.dto.User;

import com.example.Auth.model.User.User;
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
    private String verificationCode;

    public UserResponseDto(User user) { // doit être exactement comme ça
        this.matricule = user.getMatricule();
        this.username = user.getName();
        this.surname = user.getSurname();
        this.email = user.getEmail();
        this.fonction = user.getFonction();
        this.idService = user.getService().getIdService();
    }


}
