package com.example.Auth.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.Auth.dto.LoginUserDto;
import com.example.Auth.dto.RegisterUSerDto;
import com.example.Auth.dto.VerifiiedUserDto;
import com.example.Auth.model.User;
import com.example.Auth.repository.UserRepository;

import jakarta.mail.MessagingException;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthenticationService(UserRepository userRepository, PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
    }

    public User signUp (RegisterUSerDto input) {
        User user = new User(input.getUsername(),
                input.getMatricule(),
                passwordEncoder.encode(input.getPassword())
                ,input.getEmail()
        );
        user.setVerificationCode(generateVerificationCode());
        user.setVerificationExpireAt(LocalDateTime.now().plusMinutes(15));
        user.setEnabled(false);
        sendVerificationEmail(user);
        return userRepository.save(user);

    }

    public User authenticate (LoginUserDto input) {
        User user = userRepository.findByMatricule(input.getMatricule())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if(!user.isEnabled()) {
            throw new RuntimeException("User not verified");
        }

        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(input.getMatricule(), input.getPassword())
        );
        return user;
    }

    public void generateVerificationCode(VerifiiedUserDto input) {
        Optional<User> userOpt = userRepository.findByMatricule(input.getMatricule());
        if (userOpt.isPresent()) {
            User user = userOpt.get();

            /* if verification code is ealready expired */
            if(user.getVerificationExpireAt().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Verification code expired");
            }

            /* enter verification code */
            if(user.getVerificationCode().equals(input.getVerificationCode())) {
                user.setEnabled(true);
                user.setVerificationCode(null);
                user.setVerificationExpireAt(null);
                userRepository.save(user);
            } else {
                throw new RuntimeException("Invalid verification code");
            }   

        } else {
            throw new RuntimeException("User not found");
            
        }
    }

     public void verifyUser(VerifiiedUserDto input) {
        Optional<User> optionalUser = userRepository.findByMatricule(input.getMatricule());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getVerificationExpireAt().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Verification code has expired");
            }
            if (user.getVerificationCode().equals(input.getVerificationCode())) {
                user.setEnabled(true);
                user.setVerificationCode(null);
                user.setVerificationExpireAt(null);
                userRepository.save(user);
            } else {
                throw new RuntimeException("Invalid verification code");
            }
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public void resendVerificationCode(String matricule) {
        Optional<User> optionalUser = userRepository.findByMatricule(matricule);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.isEnabled()) {
                throw new RuntimeException("Account is already verified");
            }
            user.setVerificationCode(generateVerificationCode());
            user.setVerificationExpireAt(LocalDateTime.now().plusHours(1));
            sendVerificationEmail(user);
            userRepository.save(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }
    
    private void sendVerificationEmail(User user) { 
        String subject = "Account Verification";
        String verificationCode = "VERIFICATION CODE " + user.getVerificationCode();
        String htmlMessage = "<html>"
                + "<body style=\"font-family: Arial, sans-serif;\">"
                + "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
                + "<h2 style=\"color: #333;\">Welcome to our app!</h2>"
                + "<p style=\"font-size: 16px;\">Please enter the verification code below to continue:</p>"
                + "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
                + "<h3 style=\"color: #333;\">Verification Code:</h3>"
                + "<p style=\"font-size: 18px; font-weight: bold; color: #007bff;\">" + verificationCode + "</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";

        try {
            emailService.sendVerificationEmail(user.getEmail(), subject, htmlMessage);
        } catch (MessagingException e) {
            // Handle email sending exception
            e.printStackTrace();
        }
    }
    private String generateVerificationCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }
}
