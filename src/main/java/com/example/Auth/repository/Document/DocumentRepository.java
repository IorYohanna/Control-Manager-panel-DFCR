package com.example.Auth.repository.Document;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.Auth.model.Document.Document;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends ListCrudRepository<Document, String> {

    List<Document> findByType(String type);

    Optional<Document> findByReference(String reference);

    @Query("""
            SELECT d FROM Document d
            WHERE LOWER(d.objet) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(d.corps) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(d.type) LIKE LOWER(CONCAT('%', :keyword, '%'))
            """)
    List<Document> searchByKeyword(@Param("keyword") String keyword);

    List<Document> findAllByOrderByCreatedAtDesc();

    List<Document> findByStatus(String status);
}
