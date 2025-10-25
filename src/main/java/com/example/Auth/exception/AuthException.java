package com.example.Auth.exception;

public class AuthException extends RuntimeException {
    public AuthException(String message) {
        super(message);
    }

    public static class UserNotFoundException extends AuthException {
        public UserNotFoundException() {
            super("Utilisateur non trouvé");
        }
    }

    public static class InvalidPasswordException extends AuthException {
        public InvalidPasswordException() {
            super("Mot de passe incorrect");
        }
    }

    public static class UserNotVerifiedException extends AuthException {
        public UserNotVerifiedException() {
            super("Utilisateur non vérifié");
        }
    }
}
