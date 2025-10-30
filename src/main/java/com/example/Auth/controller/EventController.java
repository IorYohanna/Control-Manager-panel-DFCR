package com.example.Auth.controller;

import com.example.Auth.dto.CommentaireDto;
import com.example.Auth.dto.EventDto;
import com.example.Auth.model.Commentaire;
import com.example.Auth.model.Event;
import com.example.Auth.service.EventService;
import jakarta.annotation.security.PermitAll;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
@PermitAll
public class EventController {
    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody EventDto input) {
        if (input.getTitle() == null || input.getTitle().isBlank()) {
            return ResponseEntity.badRequest().body("Le contenu du Event est vide");
        }

        Event created = eventService.createEvent(input);
        EventDto responseDto = new EventDto(
                created.getTitle(),
                created.getDescription(),
                created.getStartTime(),
                created.getEndTime(),
                created.isAllDay(),
                created.getColor(),
                created.getEmail(),
                created.getUserName()
        );
        return ResponseEntity.status(201).body(responseDto);
    }
}
