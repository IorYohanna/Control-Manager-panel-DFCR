package com.example.Auth.controller.Security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Auth.service.Security.AuthenticationService;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AuthenticationService authenticationService;
    
    @Value("${admin.email}")
    private String adminEmail;
    
    @Value("${admin.password}")
    private String adminPassword;

    public AdminController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    /**
     * Approuver l'inscription d'un utilisateur
     * L'admin doit fournir ses identifiants dans les headers
     */
    @PostMapping("/approve/{matricule}")
    public ResponseEntity<?> approveUser(
            @PathVariable String matricule,
            @RequestHeader(value = "Admin-Email", required = false) String email,
            @RequestHeader(value = "Admin-Password", required = false) String password) {
        
        if (!isValidAdmin(email, password)) {
            return ResponseEntity.status(403)
                .body("Accès refusé : identifiants admin invalides");
        }
        
        try {
            authenticationService.approveUserRegistration(matricule);
            return ResponseEntity.ok("Inscription approuvée. L'email de vérification a été envoyé à l'utilisateur.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Rejeter l'inscription d'un utilisateur
     */
    @PostMapping("/reject/{matricule}")
    public ResponseEntity<?> rejectUser(
            @PathVariable String matricule,
            @RequestParam(required = false, defaultValue = "Non spécifiée") String reason,
            @RequestHeader(value = "Admin-Email", required = false) String email,
            @RequestHeader(value = "Admin-Password", required = false) String password) {
        
        if (!isValidAdmin(email, password)) {
            return ResponseEntity.status(403)
                .body("Accès refusé : identifiants admin invalides");
        }
        
        try {
            authenticationService.rejectUserRegistration(matricule, reason);
            return ResponseEntity.ok("Inscription rejetée et utilisateur supprimé.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Lister les inscriptions en attente (optionnel)
     */
    @GetMapping("/pending")
    public ResponseEntity<?> getPendingRegistrations(
            @RequestHeader(value = "Admin-Email", required = false) String email,
            @RequestHeader(value = "Admin-Password", required = false) String password) {
        
        if (!isValidAdmin(email, password)) {
            return ResponseEntity.status(403)
                .body("Accès refusé : identifiants admin invalides");
        }
        
        try {
            var pendingUsers = authenticationService.getPendingRegistrations();
            return ResponseEntity.ok(pendingUsers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Vérifier si les identifiants admin sont valides
     */
    private boolean isValidAdmin(String email, String password) {
        if (email == null || password == null) {
            return false;
        }
        return adminEmail.equals(email) && adminPassword.equals(password);
    }
}