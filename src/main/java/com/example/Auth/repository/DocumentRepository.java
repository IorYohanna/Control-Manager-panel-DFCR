package com.example.Auth.repository;

import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import com.example.Auth.model.Document;

@Repository
public interface DocumentRepository extends ListCrudRepository<Document, String> {
}
