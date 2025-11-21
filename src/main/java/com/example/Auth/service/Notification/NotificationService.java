package com.example.Auth.service.Notification;

import com.example.Auth.event.NotificationEvent;
import com.example.Auth.model.Notification.Notification;
import com.example.Auth.repository.Notification.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

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
