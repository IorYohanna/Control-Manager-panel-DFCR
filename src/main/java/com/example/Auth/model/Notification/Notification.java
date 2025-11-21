package com.example.Auth.model.Notification;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId; // receiver

    private String message;

    private String type;

    private boolean read = false;

    private LocalDateTime createdAt = LocalDateTime.now();
}
