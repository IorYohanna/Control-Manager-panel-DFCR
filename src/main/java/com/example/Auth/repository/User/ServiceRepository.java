package com.example.Auth.repository.User;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Auth.model.User.ServiceDfcr;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceDfcr, String> {
    List<ServiceDfcr> findAllByOrderByServiceNameAsc();
}
