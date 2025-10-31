package com.example.Auth.repository.Document;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.Auth.model.Document.Document;

import java.util.List;

@Repository
public interface DocumentRepository extends ListCrudRepository<Document, String> {

    List<Document> findByType(String type);

    @Query("""
            SELECT d FROM Document d
            WHERE LOWER(d.objet) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(d.corps) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(d.type) LIKE LOWER(CONCAT('%', :keyword, '%'))
            """)
    List<Document> searchByKeyword(@Param("keyword") String keyword);

}
