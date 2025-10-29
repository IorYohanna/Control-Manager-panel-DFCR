package com.example.Auth.repository;

import java.util.List;

import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import com.example.Auth.model.ServiceDfcr;
import com.example.Auth.model.User;

@Repository
public interface ServiceRepository extends ListCrudRepository<ServiceDfcr, String> {
    List<User> findAllByOrderByService_ServiceNameAsc();
}