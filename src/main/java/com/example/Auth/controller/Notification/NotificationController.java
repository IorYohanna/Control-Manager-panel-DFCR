package com.example.Auth.controller.Notification;

import com.example.Auth.dto.Notification.NotificationRequest;
import com.example.Auth.model.Notification.Notification;
import com.example.Auth.model.User.User;
import com.example.Auth.repository.Notification.NotificationRepository;
import com.example.Auth.repository.User.UserRepository;
import com.example.Auth.service.Notification.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{userId}")
    public Page<Notification> getUserNotifications(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        // Créer un Pageable avec tri par date décroissante
        Pageable pageable = PageRequest.of(
            page, 
            size, 
            Sort.by(Sort.Direction.DESC, "createdAt")
        );
        
        return notificationRepository.findByUserId(userId, pageable);
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

    @PostMapping("/send")
    public ResponseEntity<String> sendNotification(@RequestBody NotificationRequest request) {
        List<User> receivers = userRepository.findByMatriculeIn(request.getUserIds());

        if (receivers.isEmpty()) {
            return ResponseEntity.badRequest().body("Aucun utilisateur trouvé");
        }

        notificationService.sendToMultipleUsers(
                receivers,
                request.getType(),
                request.getMessage()
        );

        return ResponseEntity.ok("Notification envoyée à " + receivers.size() + " utilisateur(s)");
    }

    @PostMapping("/send-to-fonction")
    public ResponseEntity<String> sendToFonction(@RequestBody NotificationRequest request) {
        List<User> users = userRepository.findAllByFonction(request.getFonction());

        if (users.isEmpty()) {
            return ResponseEntity.badRequest().body("Aucun utilisateur avec cette fonction");
        }

        notificationService.sendToFonction(
                request.getFonction(),
                request.getType(),
                request.getMessage(),
                users
        );

        return ResponseEntity.ok("Notification envoyée à " + users.size() + " utilisateur(s)");
    }

    @PostMapping("/send-to-service")
    public ResponseEntity<String> sendToService(@RequestBody NotificationRequest request) {
        List<User> users = userRepository.findByService_IdService(request.getIdService());

        if (users.isEmpty()) {
            return ResponseEntity.badRequest().body("Aucun utilisateur dans ce service");
        }

        notificationService.sendToService(
                request.getIdService(),
                request.getType(),
                request.getMessage(),
                users
        );

        return ResponseEntity.ok("Notification envoyée à " + users.size() + " utilisateur(s)");
    }

    @PostMapping("/broadcast")
    public ResponseEntity<String> broadcastNotification(@RequestBody NotificationRequest request) {
        List<User> allUsers = userRepository.findAll();

        notificationService.sendToAllUsers(
                request.getType(),
                request.getMessage(),
                allUsers
        );

        return ResponseEntity.ok("Notification diffusée à " + allUsers.size() + " utilisateur(s)");
    }
}