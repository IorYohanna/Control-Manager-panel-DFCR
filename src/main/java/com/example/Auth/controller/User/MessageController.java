package com.example.Auth.controller.User;

import com.example.Auth.dto.User.MessageDto;
import com.example.Auth.model.User.Message;
import com.example.Auth.service.Notification.NotificationService;
import com.example.Auth.service.User.MessageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
public class MessageController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationService notificationService;

    public MessageController(MessageService messageService, SimpMessagingTemplate messagingTemplate, NotificationService notificationService) {
        this.messageService = messageService;
        this.messagingTemplate = messagingTemplate;
        this.notificationService = notificationService;
    }

    // WebSocket endpoint pour envoyer un message privé
    @MessageMapping("/chat")
    public void sendMessage(@Payload Map<String, String> payload, Principal principal) {
        String authenticatedUser = principal != null ? principal.getName() : null;
        System.out.println("🔍 Received message payload: " + payload);  // NEW: Log payload
        System.out.println("🔍 Authenticated user (Principal): " + authenticatedUser);  // NEW: Confirm Principal

        String senderMatricule = payload.get("senderMatricule");
        String receiverMatricule = payload.get("receiverMatricule");
        String content = payload.get("content");

        if (authenticatedUser == null || !authenticatedUser.equals(senderMatricule)) {
            System.err.println("❌ Unauthorized: " + authenticatedUser + " tried to send as " + senderMatricule);
            return;
        }

        Message savedMessage = messageService.saveMessage(senderMatricule, receiverMatricule, content);
        MessageDto dto = new MessageDto(savedMessage);

        notificationService.sendToMultipleUsers(
                List.of(savedMessage.getReceiver()),
                "NEW_MESSAGE",
                "Nouveau message de " + savedMessage.getSender().getName() + " " + savedMessage.getSender().getSurname()

        );

        messagingTemplate.convertAndSendToUser(receiverMatricule, "/queue/messages", dto);
        messagingTemplate.convertAndSendToUser(senderMatricule, "/queue/messages", dto);
    }

    // REST endpoint pour récupérer l'historique entre deux utilisateurs
    @GetMapping("/messages/{user1}/{user2}")
    public List<MessageDto> getConversation(
            @PathVariable String user1,
            @PathVariable String user2
    ) {
        // Utilise le service pour retourner la conversation correctement
        List<Message> message = messageService.getConversation(user1, user2);
        List<MessageDto> messageDtos = message.stream()
                .map(MessageDto::new)
                .toList();
        return messageDtos;
    }
    // Supprimer un message par ID (REST)
    @DeleteMapping("/messages/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id, Principal principal) {
        Message message = messageService.getById(id);

        // Vérifie que l'utilisateur est l'expéditeur
        if (!message.getSender().getMatricule().equals(principal.getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        messageService.deleteMessage(id);

        // Notifie le destinataire via WebSocket
        messagingTemplate.convertAndSendToUser(
                message.getReceiver().getMatricule(),
                "/queue/messages/delete",
                id
        );

        // Notifie l'expéditeur aussi pour mise à jour en front
        messagingTemplate.convertAndSendToUser(
                message.getSender().getMatricule(),
                "/queue/messages/delete",
                id
        );

        return ResponseEntity.ok().build();
    }

}
