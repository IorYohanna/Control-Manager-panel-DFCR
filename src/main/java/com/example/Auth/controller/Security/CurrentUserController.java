package com.example.Auth.controller.Security;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Auth.service.Security.CurrentUserService;

@RestController
@RequestMapping("/current-user")
@CrossOrigin(origins = "http://localhost:5173")
public class CurrentUserController {

    @Autowired
    private CurrentUserService currentUserService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        return ResponseEntity.ok(currentUserService.getProfile());
    }

    @GetMapping("/basic-info")
    public ResponseEntity<?> getBasicInfo() {
        return ResponseEntity.ok(currentUserService.getBasicInfo());
    }

    @GetMapping("/fullname")
    public ResponseEntity<String> getFullName() {
        return ResponseEntity.ok(currentUserService.getFullName());
    }

    @GetMapping("/email")
    public ResponseEntity<String> getEmail() {
        return ResponseEntity.ok(currentUserService.getEmail());
    }

    @GetMapping("/role")
    public ResponseEntity<String> getRole() {
        return ResponseEntity.ok(currentUserService.getRole());
    }

    @GetMapping("/service/info")
    public ResponseEntity<?> getServiceInfo() {
        return ResponseEntity.ok(currentUserService.getServiceInfo());
    }

    @GetMapping("/service/user-count")
    public ResponseEntity<Integer> getUserCount() {
        return ResponseEntity.ok(currentUserService.getUserCount());
    }

    @GetMapping("/service/event-count")
    public ResponseEntity<Integer> getEventCount() {
        return ResponseEntity.ok(currentUserService.getEventCount());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        return ResponseEntity.ok(currentUserService.getDashboard());
    }

    @GetMapping("/has-service")
    public ResponseEntity<Boolean> hasService() {
        return ResponseEntity.ok(currentUserService.hasService());
    }
}
