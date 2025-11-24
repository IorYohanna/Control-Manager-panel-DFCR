package com.example.Auth.service.Notification;

import com.example.Auth.event.NotificationEvent;
import com.example.Auth.model.Notification.Notification;
import com.example.Auth.model.User.User;
import com.example.Auth.model.workflow.Workflow;
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
        if (event.getReceiver() == null) {
            return; // Pas de destinataire, on ne fait rien
        }

        Notification notif = new Notification();
        notif.setType(event.getType());
        notif.setUserId(event.getReceiver().getMatricule());
        notif.setMessage(buildMessage(event));
        notif.setCreatedAt(LocalDateTime.now());

        Notification saved = notificationRepository.save(notif);

        messagingTemplate.convertAndSendToUser(
                saved.getUserId(),
                "/queue/notifications",
                saved);
    }

    public void sendToMultipleUsers(List<User> receivers, String type, String message) {
        List<Notification> notifications = new ArrayList<>();

        for (User receiver : receivers) {
            Notification notif = createNotification(
                    receiver.getMatricule(),
                    type,
                    message);
            notifications.add(notif);
        }

        List<Notification> savedNotifications = notificationRepository.saveAll(notifications);

        for (Notification notif : savedNotifications) {
            messagingTemplate.convertAndSendToUser(
                    notif.getUserId(),
                    "/queue/notifications",
                    notif);
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
                    message);
            notifications.add(notif);
        }

        List<Notification> savedNotifications = notificationRepository.saveAll(notifications);

        for (Notification notif : savedNotifications) {
            messagingTemplate.convertAndSendToUser(
                    notif.getUserId(),
                    "/queue/notifications",
                    notif);
        }
    }

    public void sendToFonction(String fonction, String type, String message, List<User> usersWithRole) {
        sendToMultipleUsers(usersWithRole, type, message);
    }

    public void sendToService(String idService, String type, String message, List<User> usersInDepartment) {
        sendToMultipleUsers(usersInDepartment, type, message);
    }

    private String buildMessage(NotificationEvent event) {
        String message = "";
        User sender = event.getSender();
        String senderName = (sender != null) ? sender.getSurname() : "Système";

        // Récupérer le workflow depuis l'event data
        Workflow workflow = null;
        if (event.getData() instanceof Workflow) {
            workflow = (Workflow) event.getData();
        }
        String remarque = (workflow != null && workflow.getRemarque() != null)
                ? workflow.getRemarque()
                : "";

        switch (event.getType()) {
            case "RECEPTION":
                message = "Un nouveau document est arrivé et attend votre traitement.";
                if (!remarque.isEmpty()) {
                    message += " Remarque: " + remarque;
                }
                break;

            case "ENVOI_SERVICE":
                message = senderName + " vous a envoyé un document.";
                if (!remarque.isEmpty()) {
                    message += " Remarque: " + remarque;
                }
                break;

            case "ASSIGNATION":
                message = senderName + " vous a assigné à une nouvelle tâche.";
                if (!remarque.isEmpty()) {
                    message += " Remarque: " + remarque;
                }
                break;

            case "SOUMISSION":
                message = senderName + " a terminé le traitement et vous a soumis le document.";
                if (!remarque.isEmpty()) {
                    message += " Remarque: " + remarque;
                }
                break;

            case "VALIDATION_CHEF":
                message = senderName + " a validé le document et vous l'a envoyé pour validation finale.";
                if (!remarque.isEmpty()) {
                    message += " Remarque: " + remarque;
                }
                break;

            case "REFUS_CHEF":
                message = senderName + " a refusé le document. Veuillez le retravailler.";
                if (!remarque.isEmpty()) {
                    message += " Remarque: " + remarque;
                }
                break;

            case "VALIDATION_DIRECTEUR":
                message = senderName + " a validé le document comme COMPLET.";
                if (!remarque.isEmpty()) {
                    message += " Remarque: " + remarque;
                }
                break;

            case "REFUS_DIRECTEUR":
                message = senderName + " a refusé le document (INCOMPLET). Veuillez le revoir.";
                if (!remarque.isEmpty()) {
                    message += " Remarque: " + remarque;
                }
                break;

            default:
                message = "Nouvelle notification";
                if (!remarque.isEmpty()) {
                    message += ". Remarque: " + remarque;
                }
                break;
        }

        return message;
    }
}