package com.example.Auth.repository;

import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import com.example.Auth.model.Documents;

@Repository
public interface DocumentsRepository extends ListCrudRepository<Documents, String> {
}
