package com.example.Auth.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@Table(name = "events")
public class Event {
    @Id
    @Column(name = "id_event")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEvent;
    @Column(nullable = false)
    private String title;
    private String description;
    @Column(nullable = false)
    private OffsetDateTime startTime;
    @Column(nullable = false)
    private OffsetDateTime endTime;
    private boolean allDay;
    private String color;

    @ManyToOne
    @JoinColumn(name = "created_by", referencedColumnName = "matricule", nullable = false)
    private User createdBy;

    private String email;
    private String userName;

    @ManyToOne
    @JoinColumn(name = "service", referencedColumnName = "id_service", nullable = false)
    private ServiceDfcr service;

    public Event(String title, String description, OffsetDateTime startTime, OffsetDateTime endTime, boolean allDay,
            String color) {
        this.title = title;
        this.description = description;
        this.startTime = startTime;
        this.endTime = endTime;
        this.allDay = allDay;
        this.color = color;
    }

    public Event() {
    }
}
