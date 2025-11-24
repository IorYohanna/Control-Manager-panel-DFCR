package com.example.Auth.service.Gmail;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.GmailScopes;
import com.google.api.services.gmail.model.ListMessagesResponse;
import com.google.api.services.gmail.model.Message;
import lombok.Getter;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Collections;
import java.util.List;

@Service
public class GmailService {

    private static final String APPLICATION_NAME = "Gmail API Spring Boot";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final List<String> SCOPES = Collections.singletonList(GmailScopes.GMAIL_READONLY);
    private static final String TOKENS_DIRECTORY_PATH = "tokens";

    @Getter
    private final GoogleAuthorizationCodeFlow flow;
    private final NetHttpTransport httpTransport;

    public GmailService() throws Exception {
        this.httpTransport = GoogleNetHttpTransport.newTrustedTransport();

        InputStream in = getClass().getResourceAsStream("/static/credentials.json");
        if (in == null) {
            throw new FileNotFoundException("Resource not found: /credentials.json");
        }

        GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(
                JSON_FACTORY,
                new InputStreamReader(in)
        );

        this.flow = new GoogleAuthorizationCodeFlow.Builder(
                httpTransport,
                JSON_FACTORY,
                clientSecrets,
                SCOPES)
                .setDataStoreFactory(new FileDataStoreFactory(new File(TOKENS_DIRECTORY_PATH)))
                .setAccessType("offline")
                .build();
    }

    public void saveToken(GoogleTokenResponse tokenResponse) throws IOException {
        flow.createAndStoreCredential(tokenResponse, "user");
    }

    private Gmail getGmailService() throws IOException {
        var credential = flow.loadCredential("user");
        if (credential == null) {
            throw new IOException("Aucune authentification trouvée. Veuillez vous connecter.");
        }

        return new Gmail.Builder(httpTransport, JSON_FACTORY, credential)
                .setApplicationName(APPLICATION_NAME)
                .build();
    }

    /**
     * Liste les messages (IDs uniquement - RAPIDE)
     */
    public List<Message> listMessages(int maxResults) throws IOException {
        Gmail gmail = getGmailService();

        ListMessagesResponse response = gmail.users().messages()
                .list("me")
                .setMaxResults((long) maxResults)
                .execute();

        return response.getMessages();
    }

    /**
     * Récupère un message complet avec le body (LENT)
     * Utilisez cette méthode uniquement pour voir le détail d'un email
     */
    public Message getMessage(String messageId) throws IOException {
        Gmail gmail = getGmailService();

        return gmail.users().messages()
                .get("me", messageId)
                .setFormat("full") // Charge tout le contenu
                .execute();
    }

    /**
     * OPTIMISATION: Récupère uniquement les métadonnées (headers) sans le body complet
     * Beaucoup plus rapide pour afficher une liste d'emails
     */
    public Message getMessageMetadata(String messageId) throws IOException {
        Gmail gmail = getGmailService();

        return gmail.users().messages()
                .get("me", messageId)
                .setFormat("metadata") // Charge uniquement les headers (RAPIDE)
                .setMetadataHeaders(List.of("From", "To", "Subject", "Date")) // Headers nécessaires
                .execute();
    }
}