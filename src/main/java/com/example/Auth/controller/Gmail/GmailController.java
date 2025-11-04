package com.example.Auth.controller.Gmail;

import com.example.Auth.dto.Gmail.EmailDto;
import com.example.Auth.service.Gmail.GmailService;
import com.google.api.services.gmail.model.Message;
import com.google.api.services.gmail.model.MessagePartHeader;
import jakarta.annotation.security.PermitAll;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/gmail")
@CrossOrigin(origins = "*")
public class GmailController {

    @Autowired
    private GmailService gmailService;

    @GetMapping("/messages")
    public List<EmailDto> getMessages(@RequestParam(defaultValue = "10") int maxResults) {
        try {
            List<Message> messages = gmailService.listMessages(maxResults);
            List<EmailDto> emails = new ArrayList<>();

            for (Message message : messages) {
                Message fullMessage = gmailService.getMessage(message.getId());
                EmailDto email = convertToEmailDto(fullMessage);
                emails.add(email);
            }

            return emails;
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de la récupération des emails: " + e.getMessage());
        }
    }

    @GetMapping("/messages/{messageId}")
    public EmailDto getMessage(@PathVariable String messageId) {
        try {
            Message message = gmailService.getMessage(messageId);
            return convertToEmailDto(message);
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de la récupération de l'email: " + e.getMessage());
        }
    }

    private EmailDto convertToEmailDto(Message message) {
        EmailDto email = new EmailDto();
        email.setId(message.getId());
        email.setSnippet(message.getSnippet());

        List<MessagePartHeader> headers = message.getPayload().getHeaders();
        for (MessagePartHeader header : headers) {
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

        // Extraire le corps du message
        String body = getMessageBody(message);
        email.setBody(body);

        return email;
    }

    private String getMessageBody(Message message) {
        String body = "";

        // Vérifier si body direct existe
        if (message.getPayload().getBody() != null && message.getPayload().getBody().getData() != null) {
            body = new String(Base64.getUrlDecoder().decode(message.getPayload().getBody().getData()));
        } else if (message.getPayload().getParts() != null) {
            for (var part : message.getPayload().getParts()) {
                if ((part.getMimeType().equals("text/plain") || part.getMimeType().equals("text/html"))
                        && part.getBody() != null && part.getBody().getData() != null) {
                    body = new String(Base64.getUrlDecoder().decode(part.getBody().getData()));
                    break;
                }
            }
        }

        return body;
    }

}
