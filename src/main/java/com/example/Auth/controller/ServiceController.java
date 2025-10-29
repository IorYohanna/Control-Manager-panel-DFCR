package com.example.Auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Auth.dto.ServiceDto;
import com.example.Auth.model.ServiceDfcr;
import com.example.Auth.service.ServiceService;

import java.util.List;

@RestController
@RequestMapping("/services")
public class ServiceController {

    private final ServiceService serviceService;

    public ServiceController(ServiceService serviceService) {
        this.serviceService = serviceService;
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
}
