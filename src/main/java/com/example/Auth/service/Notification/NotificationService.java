package com.example.Auth.service.Notification;

import com.example.Auth.event.NotificationEvent;
import com.example.Auth.model.Notification.Notification;
import com.example.Auth.model.User.User;
import com.example.Auth.repository.Notification.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void actionAssigneEmployer(NotificationEvent event) {
        Notification notif = new Notification();
        notif.setType(event.getType());
        notif.setUserId(event.getReceiver().getMatricule());
        notif.setMessage(buildMessage(event));
        notif.setCreatedAt(LocalDateTime.now());

        Notification saved = notificationRepository.save(notif);

        messagingTemplate.convertAndSendToUser(
                saved.getUserId(),
                "/queue/notifications",
                saved
        );
    }

    public void sendToMultipleUsers(List<User> receivers, String type, String message) {
        List<Notification> notifications = new ArrayList<>();

        for (User receiver : receivers) {
            Notification notif = createNotification(
                    receiver.getMatricule(),
                    type,
                    message
            );
            notifications.add(notif);
        }

        // Sauvegarder toutes les notifications en batch
        List<Notification> savedNotifications = notificationRepository.saveAll(notifications);

        // Envoyer via WebSocket à chaque utilisateur
        for (Notification notif : savedNotifications) {
            messagingTemplate.convertAndSendToUser(
                    notif.getUserId(),
                    "/queue/notifications",
                    notif
            );
        }
    }

    private Notification createNotification(String userId, String type, String message) {
        Notification notif = new Notification();
        notif.setUserId(userId);
        notif.setType(type);
        notif.setMessage(message);
        notif.setCreatedAt(LocalDateTime.now());
        notif.setRead(false);
        return notif;
    }

    public void sendToAllUsers(String type, String message, List<User> allUsers) {
        List<Notification> notifications = new ArrayList<>();

        for (User user : allUsers) {
            Notification notif = createNotification(
                    user.getMatricule(),
                    type,
                    message
            );
            notifications.add(notif);
        }

        // Sauvegarder toutes les notifications
        List<Notification> savedNotifications = notificationRepository.saveAll(notifications);

        // Option 1 : Envoyer individuellement (recommandé pour avoir les notifications persistées)
        for (Notification notif : savedNotifications) {
            messagingTemplate.convertAndSendToUser(
                    notif.getUserId(),
                    "/queue/notifications",
                    notif
            );
        }

        // Option 2 : Broadcast à tous (plus simple mais ne persiste pas par utilisateur)
        // messagingTemplate.convertAndSend("/topic/notifications", savedNotifications.get(0));
    }

    public void sendToFonction(String fonction, String type, String message, List<User> usersWithRole) {
        sendToMultipleUsers(usersWithRole, type, message);
    }

    public void sendToService(String idService, String type, String message, List<User> usersInDepartment) {
        sendToMultipleUsers(usersInDepartment, type, message);
    }

    private String buildMessage(NotificationEvent event) {
        String message = "";
        switch (event.getType()){
            case "ASSIGNATION":
                message = "Vous avez été assigné à une nouvelle tâche par votre chef de service.";
                break;
        }
        return message;
    }

}
