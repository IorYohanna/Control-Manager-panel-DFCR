package com.example.Auth.repository;

import org.springframework.stereotype.Repository;

import com.example.Auth.model.User;

import java.util.Optional;

import org.springframework.data.repository.ListCrudRepository;


@Repository
public interface UserRepository extends ListCrudRepository<User, String> {

    Optional<User> findByMatricule(String matricule);
    Optional<User> findByVerificationCode(String verificationCode);

}
