package com.example.Auth.controller;

import com.example.Auth.dto.EventDto;
import com.example.Auth.model.Event;
import com.example.Auth.model.User;
import com.example.Auth.service.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/events")
public class EventController {
    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<List<EventDto>> getAllEvents() {
        List<EventDto> eventDtos = eventService.getAllEvents()
                .stream()
                .map(event -> new EventDto(
                        event.getTitle(),
                        event.getDescription(),
                        event.getStartTime(),
                        event.getEndTime(),
                        event.isAllDay(),
                        event.getColor(),
                        event.getEmail(),
                        event.getUserName()
                ))
                .toList();

        return ResponseEntity.ok(eventDtos);
    }

    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody EventDto input) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

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
                currentUser.getEmail(),
                currentUser.getUsername()
        );
        return ResponseEntity.status(201).body(responseDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        try {
            eventService.deleteEvent(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
