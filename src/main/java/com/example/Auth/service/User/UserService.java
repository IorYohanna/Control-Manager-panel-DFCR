package com.example.Auth.service.User;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.Auth.model.User.User;
import com.example.Auth.repository.User.UserRepository;
import com.example.Auth.service.Security.EmailService;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
    }

    public List<User> allUsers() {
        List<User> users = new ArrayList<>();
        userRepository.findAll().forEach(users::add);
        return users;
    }
}