package com.example.Auth.controller.Notification;

import com.example.Auth.model.Notification.Notification;
import com.example.Auth.repository.Notification.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/{userId}")
    public List<Notification> getUserNotifications(@PathVariable String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @PatchMapping("/{notificationId}/read")
    public Notification markAsRead(@PathVariable Long notificationId) {
        Notification notif = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notif.setRead(true);
        return notificationRepository.save(notif);
    }

    @PatchMapping("/{userId}/read-all")
    public void markAllAsRead(@PathVariable String userId) {
        List<Notification> notifications = notificationRepository.findByUserId(userId);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }
}
