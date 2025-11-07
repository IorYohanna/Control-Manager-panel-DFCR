package com.example.Auth.service.User;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.Auth.model.User.User;
import com.example.Auth.repository.User.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> allUsers() {
        return userRepository.findAll();
    }

    public User uploadProfilePhoto(String matricule, MultipartFile file) throws IOException {
        Optional<User> optionalUser = userRepository.findByMatricule(matricule);
        
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("Utilisateur non trouvé avec le matricule : " + matricule);
        }

        User user = optionalUser.get();

        if (file != null && !file.isEmpty()) {
            if (file.getSize() > 5 * 1024 * 1024) { 
                throw new RuntimeException("La taille du fichier dépasse la limite autorisée");
            }
            user.setPhotoProfil(file.getBytes());
        } else {
            user.setPhotoProfil(null);
        }

        return userRepository.save(user);
    }

    public byte[] getProfilePhoto(String matricule) {
        return userRepository.findByMatricule(matricule)
                .map(User::getPhotoProfil) 
                .orElse(null);
    }

    public Optional<User> findByMatricule(String matricule) {
        return userRepository.findByMatricule(matricule);
    }
}