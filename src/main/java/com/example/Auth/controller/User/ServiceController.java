package com.example.Auth.controller.User;

import com.example.Auth.dto.EventResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Auth.dto.User.ServiceDto;
import com.example.Auth.dto.User.UserDto;
import com.example.Auth.model.User.ServiceDfcr;
import com.example.Auth.service.User.ServiceService;

import java.util.List;

@RestController
@RequestMapping("/services")
@CrossOrigin(origins = "http://localhost:5173")
public class ServiceController {

    private final ServiceService serviceService;

    public ServiceController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    @GetMapping("/{idService}/users")
    public ResponseEntity<?> getUsersByService(@PathVariable String idService) {
        try {
            List<UserDto> users = serviceService.getUsersByService(idService);
            return ResponseEntity.ok(users);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Erreur lors de la récupération des utilisateurs: " + e.getMessage());
        }
    }

    @GetMapping("/names")
    public ResponseEntity<List<String>> getServiceNames() {
        return ResponseEntity.ok(serviceService.getAllServiceNames());
    }

    @PostMapping
    public ResponseEntity<ServiceDfcr> createService(@RequestBody ServiceDto input) {
        ServiceDfcr created = serviceService.createService(input);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<ServiceDfcr>> getAllServices() {
        List<ServiceDfcr> services = serviceService.getAllServices();
        return ResponseEntity.ok(services);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceDfcr> getServiceById(@PathVariable String id) {
        return serviceService.getServiceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceDfcr> updateService(@PathVariable String id,
            @RequestBody ServiceDto input) {
        try {
            ServiceDfcr updated = serviceService.updateService(id, input);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable String id) {
        try {
            serviceService.deleteService(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/events/{idService}")
    public ResponseEntity<List<EventResponseDto>> getServiceEvents(@PathVariable String idService) {
        try {
            List<EventResponseDto> eventDtos = serviceService.getAllEvents(idService.toUpperCase())
                    .stream()
                    .map(EventResponseDto::new)
                    .toList();
            return ResponseEntity.ok(eventDtos);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
