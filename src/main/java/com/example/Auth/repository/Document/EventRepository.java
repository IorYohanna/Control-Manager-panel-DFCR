package com.example.Auth.repository.Document;

import com.example.Auth.model.Document.Event;
import com.example.Auth.model.User.User;
import com.example.Auth.model.User.ServiceDfcr;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {
    Optional<List<Event>> findByService(ServiceDfcr service);
    Optional<List<Event>> findByCreatedBy(User user);
}
