package com.example.Auth.repository.Document;

import com.example.Auth.model.Document.Concerner;
import com.example.Auth.model.Document.ConcernerId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConcernerRepository extends JpaRepository<Concerner, ConcernerId> {
}
