package com.example.Auth.repository.Notification;

import com.example.Auth.model.Notification.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);

    List<Notification> findByUserIdAndReadFalseOrderByCreatedAtDesc(String userId);

    long countByUserIdAndReadFalse(String userId);

    // Méthode avec pagination
    Page<Notification> findByUserId(String userId, Pageable pageable);
    
    // Méthode sans pagination (pour markAllAsRead)
    List<Notification> findByUserId(String userId);
}
