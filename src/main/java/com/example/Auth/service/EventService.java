package com.example.Auth.service;

import com.example.Auth.dto.EventDto;
import com.example.Auth.model.Event;
import com.example.Auth.model.ServiceDfcr;
import com.example.Auth.model.User;
import com.example.Auth.repository.EventRepository;
import com.example.Auth.repository.ServiceRepository;
import com.example.Auth.repository.UserRepository;
import com.example.Auth.utils.LoggerService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final LoggerService log;

    public EventService(EventRepository eventRepository, UserRepository userRepository, ServiceRepository serviceRepository, LoggerService log) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.log = log;
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Utilisateur non authentifié");
        }

        log.info("Utilisateur actuel : " + authentication.getName());
        String matricule = authentication.getName();

        return userRepository.findByMatricule(matricule)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec matricule : " + matricule));
    }

    private ServiceDfcr getServiceById(String id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service non trouvé avec id : " + id));
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event createEvent(EventDto input) {
        User currentUser = getCurrentUser();
        log.info("Création de l'événement pour l'utilisateur : " + currentUser.getMatricule());
        ServiceDfcr service = getServiceById(currentUser.getService().getIdService());
        log.info("Service trouvé : " + currentUser.getService().getIdService());

        Event event = new Event();
        event.setTitle(input.getTitle());
        event.setDescription(input.getDescription());
        event.setStartTime(input.getStartTime());
        event.setEndTime(input.getEndTime());
        event.setAllDay(input.getAllDay());
        event.setColor(input.getColor());
        event.setEmail(currentUser.getEmail());
        event.setUserName(currentUser.getUsername());
        event.setCreatedBy(currentUser);
        event.setService(service);

        return eventRepository.save(event);
    }

    public void deleteEvent(Long eventId) {
        eventRepository.deleteById(eventId);
    }

    public Event updateEvent(Event event) {
        return eventRepository.save(event);
    }
}
