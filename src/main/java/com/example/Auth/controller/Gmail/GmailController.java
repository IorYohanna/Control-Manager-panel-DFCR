package com.example.Auth.controller.Gmail;

import com.example.Auth.dto.Gmail.EmailDto;
import com.example.Auth.service.Gmail.GmailService;
import com.google.api.services.gmail.model.Message;
import com.google.api.services.gmail.model.MessagePart;
import com.google.api.services.gmail.model.MessagePartHeader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gmail")
@CrossOrigin(origins = "*")
public class GmailController {

    @Autowired
    private GmailService gmailService;

    @GetMapping("/messages")
    public ResponseEntity<?> getAllMessages(@RequestParam(defaultValue = "10") int maxResults) {
        try {
            List<Message> messages = gmailService.listMessages(maxResults);

            if (messages == null) {
                return ResponseEntity.ok(new ArrayList<>());
            }

            List<EmailDto> emails = new ArrayList<>();

            for (Message message : messages) {
                try {
                    Message fullMessage = gmailService.getMessage(message.getId());
                    EmailDto email = convertToEmailDto(fullMessage);
                    emails.add(email);
                } catch (Exception e) {
                    // Log l'erreur mais continue avec les autres messages
                    System.err.println("Erreur pour le message " + message.getId() + ": " + e.getMessage());
                }
            }

            return ResponseEntity.ok(emails);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de la récupération des emails: " + e.getMessage()));
        }
    }

    @GetMapping("/messages/{messageId}")
    public ResponseEntity<?> getMessage(@PathVariable String messageId) {
        try {
            Message message = gmailService.getMessage(messageId);
            return ResponseEntity.ok(convertToEmailDto(message));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de la récupération de l'email: " + e.getMessage()));
        }
    }

    private EmailDto convertToEmailDto(Message message) {
        EmailDto email = new EmailDto();
        email.setId(message.getId());
        email.setSnippet(message.getSnippet());

        // Vérification null avant d'accéder aux headers
        if (message.getPayload() != null && message.getPayload().getHeaders() != null) {
            List<MessagePartHeader> headers = message.getPayload().getHeaders();

            for (MessagePartHeader header : headers) {
                if (header.getName() == null) continue;

                switch (header.getName()) {
                    case "From":
                        email.setFrom(header.getValue());
                        break;
                    case "Subject":
                        email.setSubject(header.getValue());
                        break;
                    case "Date":
                        email.setDate(header.getValue());
                        break;
                }
            }
        }

        // Extraire le corps du message avec gestion null
        String body = getMessageBody(message);
        email.setBody(body);

        return email;
    }

    private String getMessageBody(Message message) {
        if (message.getPayload() == null) {
            return "";
        }

        // Cas 1: Corps directement dans le payload
        if (message.getPayload().getBody() != null
                && message.getPayload().getBody().getData() != null) {
            return decodeBase64(message.getPayload().getBody().getData());
        }

        // Cas 2: Corps dans les parties (multipart)
        if (message.getPayload().getParts() != null) {
            return extractBodyFromParts(message.getPayload().getParts());
        }

        return "";
    }

    private String extractBodyFromParts(List<MessagePart> parts) {
        for (MessagePart part : parts) {
            if (part.getMimeType() == null) continue;

            // Priorité au text/plain, sinon text/html
            if (part.getMimeType().equals("text/plain")) {
                if (part.getBody() != null && part.getBody().getData() != null) {
                    return decodeBase64(part.getBody().getData());
                }
            }
        }

        // Si pas de text/plain, chercher text/html
        for (MessagePart part : parts) {
            if (part.getMimeType() == null) continue;

            if (part.getMimeType().equals("text/html")) {
                if (part.getBody() != null && part.getBody().getData() != null) {
                    return decodeBase64(part.getBody().getData());
                }
            }

            // Gestion récursive pour les parties imbriquées
            if (part.getMimeType().startsWith("multipart/") && part.getParts() != null) {
                String nestedBody = extractBodyFromParts(part.getParts());
                if (!nestedBody.isEmpty()) {
                    return nestedBody;
                }
            }
        }

        return "";
    }

    private String decodeBase64(String data) {
        try {
            return new String(Base64.getUrlDecoder().decode(data));
        } catch (IllegalArgumentException e) {
            System.err.println("Erreur de décodage Base64: " + e.getMessage());
            return "";
        }
    }
}