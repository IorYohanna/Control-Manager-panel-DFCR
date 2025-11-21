package com.example.Auth.listener;

import com.example.Auth.event.NotificationEvent;
import com.example.Auth.service.Notification.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class NotificationListener {
    @Autowired
    private NotificationService notificationService;

    @EventListener
    public void handleNotificationEvent(NotificationEvent event) {
        notificationService.actionAssigneEmployer(event);
    }
}
