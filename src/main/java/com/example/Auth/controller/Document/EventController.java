package com.example.Auth.controller.Document;

import com.example.Auth.dto.EventDto;
import com.example.Auth.dto.EventResponseDto;
import com.example.Auth.model.Document.Event;
import com.example.Auth.service.Document.EventService;

import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<EventResponseDto>> getAllEvents() {
        List<EventResponseDto> eventDtos = eventService.getAllEvents()
                .stream()
                .map(EventResponseDto::new)
                .toList();

        return ResponseEntity.ok(eventDtos);
    }

    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody EventDto input) {
        if (input.getTitle() == null || input.getTitle().isBlank()) {
            return ResponseEntity.badRequest().body("Le contenu du Event est vide");
        }

        Event event = eventService.createEvent(input);

        EventResponseDto dto = new EventResponseDto(event);

        return ResponseEntity.status(201).body(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable Long id, @RequestBody EventDto input) {
        try {
            Event updated = eventService.updateEvent(id, input);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable String id) {
        try {
            eventService.deleteEvent(Long.valueOf(id));
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
