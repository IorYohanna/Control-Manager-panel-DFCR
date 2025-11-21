package com.example.Auth.controller.Notification;

import com.example.Auth.dto.Notification.NotificationRequest;
import com.example.Auth.model.Notification.Notification;
import com.example.Auth.model.User.User;
import com.example.Auth.repository.Notification.NotificationRepository;
import com.example.Auth.repository.User.UserRepository;
import com.example.Auth.service.Notification.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
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

    // ========== RÉCUPÉRATION DES NOTIFICATIONS ==========

    /**
     * Récupérer toutes les notifications d'un utilisateur
     * GET /notifications/{userId}
     */
    @GetMapping("/{userId}")
    public List<Notification> getUserNotifications(@PathVariable String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Marquer une notification comme lue
     * PATCH /notifications/{notificationId}/read
     */
    @PatchMapping("/{notificationId}/read")
    public Notification markAsRead(@PathVariable Long notificationId) {
        Notification notif = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notif.setRead(true);
        return notificationRepository.save(notif);
    }

    /**
     * Marquer toutes les notifications d'un utilisateur comme lues
     * PATCH /notifications/{userId}/read-all
     */
    @PatchMapping("/{userId}/read-all")
    public void markAllAsRead(@PathVariable String userId) {
        List<Notification> notifications = notificationRepository.findByUserId(userId);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    // ========== ENVOI DE NOTIFICATIONS ==========

    /**
     * Envoyer une notification à plusieurs utilisateurs spécifiques
     * POST /notifications/send
     *
     * Body:
     * {
     *   "userIds": ["EMP001", "EMP002", "EMP003"],
     *   "type": "TASK_ASSIGNED",
     *   "message": "Vous avez une nouvelle tâche"
     * }
     */
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

    /**
     * Envoyer une notification à tous les utilisateurs d'une fonction
     * POST /notifications/send-to-fonction
     *
     * Body:
     * {
     *   "fonction": "Chef de service",
     *   "type": "MEETING_SCHEDULED",
     *   "message": "Réunion des chefs demain à 10h"
     * }
     */
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

    /**
     * Envoyer une notification à tous les utilisateurs d'un service
     * POST /notifications/send-to-service
     *
     * Body:
     * {
     *   "idService": "SRV001",
     *   "type": "SERVICE_UPDATE",
     *   "message": "Nouvelle procédure pour le service"
     * }
     */
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

    /**
     * Envoyer une notification à TOUS les utilisateurs
     * POST /notifications/broadcast
     *
     * Body:
     * {
     *   "type": "SYSTEM_MAINTENANCE",
     *   "message": "Maintenance du système ce samedi"
     * }
     */
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