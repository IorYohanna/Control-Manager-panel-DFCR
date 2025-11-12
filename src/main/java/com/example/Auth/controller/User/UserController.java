package com.example.Auth.controller.User;

import com.example.Auth.dto.User.UserResponseDto;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.Auth.dto.User.UserDto;
import com.example.Auth.model.User.User;
import com.example.Auth.service.User.UserService;

import java.util.List;
import org.springframework.web.bind.annotation.RequestBody;

@RequestMapping("/users")
@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/{matricule}")
    public ResponseEntity<User> updateUser(@PathVariable String matricule, @RequestBody UserDto input) {
        try {
            User updated = userService.updateUser(matricule, input);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{matricule}")
    public ResponseEntity<Void> deleteUser(@PathVariable String matricule) {
        try {
            userService.deleteUser(matricule);
            return ResponseEntity.noContent().build();

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{matricule}/photo")
    public ResponseEntity<String> uploadPhoto(@PathVariable String matricule,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            userService.uploadProfilePhoto(matricule, file);
            return ResponseEntity.ok("Photo uploadée ou mise à jour avec succès !");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur lors de l'upload : " + e.getMessage());
        }
    }

    @GetMapping("/{matricule}/photo")
    public ResponseEntity<byte[]> getPhoto(@PathVariable String matricule) {
        byte[] photo = userService.getProfilePhoto(matricule);
        if (photo == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, MediaType.IMAGE_JPEG_VALUE)
                .body(photo);
    }

    @GetMapping("/me")
    public ResponseEntity<User> authenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        return ResponseEntity.ok(currentUser);
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDto>> GetAllUsers() {
        List<User> users = userService.allUsers();
        List<UserResponseDto> userDtos = users.stream()
                .map(UserResponseDto::new)
                .toList();
        return ResponseEntity.ok(userDtos);
    }


    // ✅ Endpoint pour obtenir l'utilisateur connecté
    @GetMapping("/auth/me")
    public User getCurrentUser() {
        return currentUserService.getCurrentUser();
    }

    @GetMapping("/hello")
    @PreAuthorize("hasRole('ROLE_chef')")
    public String hello() {
        return "Hello, Authenticated User!";
    }
}