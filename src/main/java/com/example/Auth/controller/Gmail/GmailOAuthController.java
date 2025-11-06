package com.example.Auth.controller.Gmail;

import com.example.Auth.service.Gmail.GmailService;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.gmail.GmailScopes;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Collections;
import java.util.HashMap;
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
    public void callback(@RequestParam String code, HttpServletResponse response) throws IOException {
        try {
            GoogleTokenResponse tokenResponse = gmailService.getFlow()
                    .newTokenRequest(code)
                    .setRedirectUri(redirectUri)
                    .execute();

            gmailService.saveToken(tokenResponse);

            // Redirige vers le front avec un flag
            response.sendRedirect("http://localhost:5173/email?gmailLoginSuccess=true");

        } catch (Exception e) {
            response.sendRedirect("http://localhost:5173/email?gmailLoginSuccess=false");
        }
    }


}
