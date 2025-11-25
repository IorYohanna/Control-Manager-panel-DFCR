package com.example.Auth.controller.Gmail;

import com.example.Auth.service.Gmail.GmailService;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/auth/gmail")
public class GmailOAuthController {

    @Autowired
    private GmailService gmailService;

    @Value("${google.client.redirect-uri}")
    private String redirectUri;

    @GetMapping("/url")
    public Map<String, String> getUrl() {
        String url = gmailService.getFlow()
                .newAuthorizationUrl()
                .setRedirectUri(redirectUri)
                .build();

        return Map.of("url", url);
    }

    @GetMapping("/callback")
    public void callback(@RequestParam String code, HttpServletResponse response, HttpSession session) throws IOException {
        try {
            GoogleTokenResponse tokenResponse = gmailService.getFlow()
                    .newTokenRequest(code)
                    .setRedirectUri(redirectUri)
                    .execute();

            gmailService.saveToken(tokenResponse);
            session.setAttribute("gmail_access_token", tokenResponse.getAccessToken());

            // ✅ Redirige vers la page callback qui fermera la popup
            response.sendRedirect("http://localhost:5173/gmail-callback?success=true");

        } catch (Exception e) {
            response.sendRedirect("http://localhost:5173/gmail-callback?success=false");
        }
    }

    @GetMapping("/status")
    public ResponseEntity<?> status(HttpSession session) {
        String token = (String) session.getAttribute("gmail_access_token");

        if (token == null) {
            return ResponseEntity.status(403).body("{\"authenticated\": false}");
        }

        return ResponseEntity.ok(Map.of("authenticated", true));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        // Supprime toutes les infos de session liées à Gmail
        session.removeAttribute("gmail_access_token");
        session.invalidate(); // détruit la session entière si tu veux
        return ResponseEntity.ok(Map.of("message", "Déconnexion réussie"));
    }

}
