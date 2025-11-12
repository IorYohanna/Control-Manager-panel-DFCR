package com.example.Auth.model.User;

import com.example.Auth.model.User.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "echanger")
@Getter
@Setter
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private LocalDateTime sentAt;

    @PrePersist
    public void prePersist() {
        sentAt = LocalDateTime.now();
    }
}