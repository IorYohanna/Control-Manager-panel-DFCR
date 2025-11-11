package com.example.Auth.repository.User;

import org.springframework.stereotype.Repository;

import com.example.Auth.model.User.User;

import java.util.Optional;

import org.springframework.data.repository.ListCrudRepository;

@Repository
public interface UserRepository extends ListCrudRepository<User, String> {

    Optional<User> findByMatricule(String matricule);
    Optional<User> findByEmail(String email);
    Optional<User> findByVerificationCode(String verificationCode);
    Optional<User> findByFonction(String fonction);

}
