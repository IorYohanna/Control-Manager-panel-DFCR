package com.example.Auth.service.User;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.example.Auth.dto.User.UserDto;
import com.example.Auth.model.User.ServiceDfcr;
import com.example.Auth.model.User.User;
import com.example.Auth.repository.User.ServiceRepository;
import com.example.Auth.repository.User.UserRepository;
import com.example.Auth.utils.LoggerService;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final LoggerService log;
    private final ServiceRepository serviceRepository;

    public UserService(UserRepository userRepository, LoggerService log, ServiceRepository serviceRepository) {
        this.userRepository = userRepository;
        this.log = log;
        this.serviceRepository = serviceRepository;
    }

    public List<User> allUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(String matricule) {
        Optional<User> opt = userRepository.findByMatricule(matricule);
        if (opt.isEmpty()) {
            throw new RuntimeException("Utilisateur n'existe pas" + matricule);
        }
        userRepository.deleteById(matricule);
        log.success("Utilisateur supprimé avec succès");
    }

    public User updateUser(String matricule, UserDto input) {
        User user = userRepository.findByMatricule(matricule)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Utilisateur introuvable avec le matricule: " + matricule));

        if (input.getSurname() != null)
            user.setSurname(input.getSurname());
        if (input.getUsername() != null)
            user.setUsername(input.getUsername());
        if (input.getEmail() != null)
            user.setEmail(input.getEmail());
        if (input.getFonction() != null)
            user.setFonction(input.getFonction());
        if (input.getContact() != null && !input.getContact().isEmpty())
            user.setContact(Integer.valueOf(input.getContact()));

        if (input.getIdservice() != null) {
            ServiceDfcr service = serviceRepository.findById(input.getIdservice())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Service introuvable avec l’ID: " + input.getIdservice()));
            user.setService(service);
        }

        if (input.getScore() != null) {
            user.setScore(Integer.valueOf(input.getScore()));
        }
        if(input.getEvaluation() != null) {
            user.setEvaluation(input.getEvaluation());
        }

        return userRepository.save(user);
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