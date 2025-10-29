package com.example.Auth.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import com.example.Auth.model.Document;
import java.util.List;


@Repository
public interface DocumentRepository extends ListCrudRepository<Document, String> {

    List<Document> findByType(String type);

    @Query(
    "SELECT d FROM document WHERE d.objet LIKE CONCAT('%', :keyword , '%')" +
    "OR d.corps LIKE CONCAT('%', :keyword, '%')" +
    "OR d.type LIKE CONCAT('%', :keyword, '%')" 
    )
    List<Document> searchByKeyword (String keyword);


}
