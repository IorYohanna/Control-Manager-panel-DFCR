package com.example.Auth.reposnses;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ErrorUserResponse {
    public String message;

    public ErrorUserResponse(String message) {
        this.message = message;
    }
}
