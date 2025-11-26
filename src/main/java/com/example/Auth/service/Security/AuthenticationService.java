package com.example.Auth.service.Security;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import com.example.Auth.exception.AuthException;
import com.example.Auth.model.User.ServiceDfcr;
import com.example.Auth.model.User.User;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.Auth.dto.Security.LoginUserDto;
import com.example.Auth.dto.Security.RegisterUSerDto;
import com.example.Auth.dto.Security.VerifiedUserDto;
import com.example.Auth.dto.User.UserResponseDto;
import com.example.Auth.repository.User.ServiceRepository;
import com.example.Auth.repository.User.UserRepository;

import jakarta.mail.MessagingException;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final ServiceRepository serviceRepository;

    public AuthenticationService(UserRepository userRepository, PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager, EmailService emailService,
            ServiceRepository serviceRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
        this.serviceRepository = serviceRepository;
    }

    public UserResponseDto signUp(RegisterUSerDto input) {
        if (userRepository.findByEmail(input.getEmail()).isPresent()) {
            throw new RuntimeException("Cet email est déjà utilisé !");
        }

        ServiceDfcr service = serviceRepository.findById(input.getIdService())
                .orElseThrow(() -> new RuntimeException("Service introuvable : " + input.getIdService()));

        User user = new User(
                input.getMatricule(),
                input.getSurname(),
                input.getUsername(),
                passwordEncoder.encode(input.getPassword()),
                input.getEmail(),
                input.getFonction(),
                input.getContact(),
                service);

        user.setVerificationCode(generateVerificationCode());
        user.setVerificationExpireAt(LocalDateTime.now().plusMinutes(15));
        user.setEnabled(false);
        user.setApprovedByAdmin(false); 

        sendAdminApprovalEmail(user);

        userRepository.save(user);

        return new UserResponseDto(
                user.getMatricule(),
                user.getUsername(),
                user.getSurname(),
                user.getEmail(),
                user.getFonction(),
                user.getContact().toString(),
                user.getService().getServiceName(),
                user.isEnabled(),
                null 
        );
    }

    /**
     * Méthode appelée par l'admin pour approuver l'inscription
     */
    public void approveUserRegistration(String matricule) {
        User user = userRepository.findByMatricule(matricule)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (user.isApprovedByAdmin()) {
            throw new RuntimeException("Cet utilisateur est déjà approuvé");
        }

        user.setApprovedByAdmin(true);

        user.setVerificationCode(generateVerificationCode());
        user.setVerificationExpireAt(LocalDateTime.now().plusMinutes(15));

        userRepository.save(user);

        sendVerificationEmail(user);
    }

    /**
     * Méthode pour rejeter l'inscription
     */
    public void rejectUserRegistration(String matricule, String reason) {
        User user = userRepository.findByMatricule(matricule)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        sendRejectionEmail(user, reason);

        userRepository.delete(user);
    }

    public User authenticate(LoginUserDto input) {
        User user = userRepository.findByMatricule(input.getMatricule())
                .orElseThrow(AuthException.UserNotFoundException::new);

        if (!user.isApprovedByAdmin()) {
            throw new RuntimeException("Votre inscription est en attente de validation par l'administrateur");
        }

        if (!user.isEnabled()) {
            throw new RuntimeException("Veuillez vérifier votre email avec le code de vérification");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(input.getMatricule(), input.getPassword()));
        } catch (BadCredentialsException e) {
            throw new AuthException.InvalidPasswordException();
        }
        return user;
    }

    public void verifyUser(VerifiedUserDto input) {
        Optional<User> optionalUser = userRepository.findByMatricule(input.getMatricule());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            if (!user.isApprovedByAdmin()) {
                throw new RuntimeException("Votre inscription n'a pas encore été approuvée par l'administrateur");
            }

            if (user.getVerificationExpireAt().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Le code de vérification a expiré");
            }

            if (user.getVerificationCode().equals(input.getVerificationCode())) {
                user.setEnabled(true);
                user.setVerificationCode(null);
                user.setVerificationExpireAt(null);
                userRepository.save(user);
            } else {
                throw new RuntimeException("Code de vérification invalide");
            }
        } else {
            throw new RuntimeException("Utilisateur introuvable");
        }
    }

    public void resendVerificationCode(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            if (!user.isApprovedByAdmin()) {
                throw new RuntimeException("Votre inscription n'a pas encore été approuvée par l'administrateur");
            }

            if (user.isEnabled()) {
                throw new RuntimeException("Le compte est déjà vérifié");
            }

            user.setVerificationCode(generateVerificationCode());
            user.setVerificationExpireAt(LocalDateTime.now().plusMinutes(15));
            sendVerificationEmail(user);
            userRepository.save(user);
        } else {
            throw new RuntimeException("Utilisateur introuvable");
        }
    }

    /**
     * Envoyer email à l'admin pour qu'il valide l'inscription
     */
    private void sendAdminApprovalEmail(User user) {
        String adminEmail = "nanajounchan@gmail.com";
        String subject = "Nouvelle inscription en attente de validation";

        String htmlMessage = "<html>"
                + "<body style=\"font-family: Arial, sans-serif;\">"
                + "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
                + "<h2 style=\"color: #333;\">Nouvelle demande d'inscription</h2>"
                + "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
                + "<p><strong>Matricule:</strong> " + user.getMatricule() + "</p>"
                + "<p><strong>Nom:</strong> " + user.getSurname() + "</p>"
                + "<p><strong>Prénom:</strong> " + user.getUsername() + "</p>"
                + "<p><strong>Email:</strong> " + user.getEmail() + "</p>"
                + "<p><strong>Fonction:</strong> " + user.getFonction() + "</p>"
                + "<p><strong>Contact:</strong> " + user.getContact() + "</p>"
                + "<p><strong>Service:</strong> " + user.getService().getServiceName() + "</p>"
                + "<br>"
                + "<p>Veuillez approuver ou rejeter cette inscription depuis votre panneau d'administration.</p>"
                + "<p>Lien d'approbation: <a href='http://localhost:8080/admin/approve/" + user.getMatricule()
                + "'>Approuver</a></p>"
                + "<p>Lien de rejet: <a href='http://localhost:8080/admin/reject/" + user.getMatricule()
                + "'>Rejeter</a></p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";

        try {
            emailService.sendVerificationEmail(adminEmail, subject, htmlMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de l'envoi de l'email à l'administrateur");
        }
    }

    /**
     * Envoyer email de vérification à l'utilisateur (après approbation admin)
     */
    private void sendVerificationEmail(User user) {
        String subject = "Code de vérification - Compte approuvé";
        String verificationCode = user.getVerificationCode();

        String htmlMessage = "<html>"
                + "<body style=\"font-family: Arial, sans-serif;\">"
                + "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
                + "<h2 style=\"color: #333;\">Bienvenue sur notre plateforme !</h2>"
                + "<p style=\"font-size: 16px;\">Votre inscription a été approuvée par l'administrateur.</p>"
                + "<p style=\"font-size: 16px;\">Veuillez entrer le code de vérification ci-dessous pour activer votre compte :</p>"
                + "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
                + "<h3 style=\"color: #333;\">Code de vérification :</h3>"
                + "<p style=\"font-size: 24px; font-weight: bold; color: #007bff; letter-spacing: 3px;\">"
                + verificationCode + "</p>"
                + "<p style=\"font-size: 14px; color: #666;\">Ce code expire dans 15 minutes.</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";

        try {
            emailService.sendVerificationEmail(user.getEmail(), subject, htmlMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de l'envoi de l'email de vérification");
        }
    }

    /**
     * Envoyer email de rejet à l'utilisateur
     */
    private void sendRejectionEmail(User user, String reason) {
        String subject = "Inscription refusée";

        String htmlMessage = "<html>"
                + "<body style=\"font-family: Arial, sans-serif;\">"
                + "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
                + "<h2 style=\"color: #d9534f;\">Inscription refusée</h2>"
                + "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
                + "<p>Bonjour " + user.getUsername() + ",</p>"
                + "<p>Nous sommes désolés de vous informer que votre demande d'inscription a été refusée.</p>"
                + "<p><strong>Raison :</strong> " + reason + "</p>"
                + "<p>Si vous pensez qu'il s'agit d'une erreur, veuillez contacter l'administrateur.</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";

        try {
            emailService.sendVerificationEmail(user.getEmail(), subject, htmlMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    /**
     * Récupérer la liste des inscriptions en attente
     */
    public List<UserResponseDto> getPendingRegistrations() {
        List<User> pendingUsers = userRepository.findByApprovedByAdminFalse();

        return pendingUsers.stream()
                .map(user -> new UserResponseDto(
                        user.getMatricule(),
                        user.getUsername(),
                        user.getSurname(),
                        user.getEmail(),
                        user.getFonction(),
                        user.getContact().toString(),
                        user.getService().getServiceName(),
                        user.isEnabled(),
                        null))
                .collect(java.util.stream.Collectors.toList());
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }
}