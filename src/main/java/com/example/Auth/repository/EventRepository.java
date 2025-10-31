package com.example.Auth.repository;

import com.example.Auth.model.Event;
import com.example.Auth.model.ServiceDfcr;
import com.example.Auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {
    Optional<List<Event>> findByService(ServiceDfcr service);

    Optional<List<Event>> findByCreatedBy(User user);
}
