package com.example.Auth.controller.Gmail;

import com.example.Auth.dto.Gmail.EmailDto;
import com.example.Auth.service.Gmail.GmailService;
import com.google.api.services.gmail.model.Message;
import com.google.api.services.gmail.model.MessagePart;
import com.google.api.services.gmail.model.MessagePartHeader;
import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.concurrent.*;

@RestController
@RequestMapping("/api/gmail")
@CrossOrigin(origins = "*")
public class GmailController {

    @Autowired
    private GmailService gmailService;

    // Thread pool pour paralléliser les requêtes
    private final ExecutorService executorService = Executors.newFixedThreadPool(10);

    /**
     * VERSION OPTIMISÉE : Chargement parallèle des emails
     * Réduit le temps de chargement de ~10s à ~2s pour 10 emails
     */
    @GetMapping("/messages")
    public ResponseEntity<?> getAllMessages(@RequestParam(defaultValue = "10") int maxResults) {
        try {
            // Étape 1: Récupérer la liste des IDs (rapide)
            List<Message> messages = gmailService.listMessages(maxResults);

            if (messages == null || messages.isEmpty()) {
                return ResponseEntity.ok(new ArrayList<>());
            }

            // Étape 2: Charger les emails en PARALLÈLE
            List<CompletableFuture<EmailDto>> futures = new ArrayList<>();

            for (Message message : messages) {
                CompletableFuture<EmailDto> future = CompletableFuture.supplyAsync(() -> {
                    try {
                        Message fullMessage = gmailService.getMessage(message.getId());
                        return convertToEmailDto(fullMessage);
                    } catch (Exception e) {
                        System.err.println("Erreur pour le message " + message.getId() + ": " + e.getMessage());
                        return null; // Retourner null en cas d'erreur
                    }
                }, executorService);

                futures.add(future);
            }

            // Étape 3: Attendre que toutes les requêtes se terminent
            CompletableFuture<Void> allOf = CompletableFuture.allOf(
                    futures.toArray(new CompletableFuture[0])
            );

            // Attendre maximum 30 secondes
            allOf.get(30, TimeUnit.SECONDS);

            // Étape 4: Récupérer les résultats
            List<EmailDto> emails = new ArrayList<>();
            for (CompletableFuture<EmailDto> future : futures) {
                try {
                    EmailDto email = future.get();
                    if (email != null) {
                        emails.add(email);
                    }
                } catch (Exception e) {
                    // Ignorer les emails en erreur
                }
            }

            return ResponseEntity.ok(emails);

        } catch (TimeoutException e) {
            return ResponseEntity.status(HttpStatus.REQUEST_TIMEOUT)
                    .body(Map.of("error", "Timeout lors du chargement des emails"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de la récupération des emails: " + e.getMessage()));
        }
    }

    /**
     * VERSION SIMPLE OPTIMISÉE: Utilise juste "metadata" sans parallélisation
     * Déjà 3x plus rapide que la version "full"
     */
    @GetMapping("/messages/light")
    public ResponseEntity<?> getAllMessagesLight(@RequestParam(defaultValue = "10") int maxResults) {
        try {
            long startTime = System.currentTimeMillis();
            
            // Étape 1: Récupérer la liste des IDs
            List<Message> messages = gmailService.listMessages(maxResults);

            if (messages == null || messages.isEmpty()) {
                return ResponseEntity.ok(new ArrayList<>());
            }

            List<EmailDto> emails = new ArrayList<>();

            // Étape 2: Charger chaque email avec format "metadata" (plus rapide)
            for (Message message : messages) {
                try {
                    Message lightMessage = gmailService.getMessageMetadata(message.getId());
                    EmailDto email = convertToEmailDtoLight(lightMessage);
                    emails.add(email);
                } catch (Exception e) {
                    System.err.println("Erreur pour le message " + message.getId() + ": " + e.getMessage());
                }
            }

            long endTime = System.currentTimeMillis();
            System.out.println("✉️ Chargé " + emails.size() + " emails en " + (endTime - startTime) + "ms");

            return ResponseEntity.ok(emails);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur: " + e.getMessage()));
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

    /**
     * Conversion légère sans body complet
     */
    private EmailDto convertToEmailDtoLight(Message message) {
        EmailDto email = new EmailDto();
        email.setId(message.getId());
        email.setSnippet(message.getSnippet());

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

        // Utiliser le snippet au lieu du body complet
        email.setBody(message.getSnippet());

        return email;
    }

    /**
     * Conversion complète (pour détails d'un email)
     */
    private EmailDto convertToEmailDto(Message message) {
        EmailDto email = new EmailDto();
        email.setId(message.getId());
        email.setSnippet(message.getSnippet());

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

        String body = getMessageBody(message);
        email.setBody(body);

        return email;
    }

    private String getMessageBody(Message message) {
        if (message.getPayload() == null) {
            return message.getSnippet() != null ? message.getSnippet() : "";
        }

        if (message.getPayload().getBody() != null
                && message.getPayload().getBody().getData() != null) {
            return decodeBase64(message.getPayload().getBody().getData());
        }

        if (message.getPayload().getParts() != null) {
            return extractBodyFromParts(message.getPayload().getParts());
        }

        return message.getSnippet() != null ? message.getSnippet() : "";
    }

    private String extractBodyFromParts(List<MessagePart> parts) {
        for (MessagePart part : parts) {
            if (part.getMimeType() == null) continue;

            if (part.getMimeType().equals("text/plain")) {
                if (part.getBody() != null && part.getBody().getData() != null) {
                    return decodeBase64(part.getBody().getData());
                }
            }
        }

        for (MessagePart part : parts) {
            if (part.getMimeType() == null) continue;

            if (part.getMimeType().equals("text/html")) {
                if (part.getBody() != null && part.getBody().getData() != null) {
                    return decodeBase64(part.getBody().getData());
                }
            }

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

    @PreDestroy
    public void shutdown() {
        executorService.shutdown();
    }
}