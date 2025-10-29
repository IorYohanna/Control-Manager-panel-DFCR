package com.example.Auth.service;

import org.springframework.stereotype.Service;

import com.example.Auth.dto.ServiceDto;
import com.example.Auth.model.ServiceDfcr;
import com.example.Auth.repository.ServiceRepository;
import com.example.Auth.utils.LoggerService;

import java.util.List;
import java.util.Optional;

@Service
public class ServiceService {

    private final ServiceRepository serviceRepository;
    private final LoggerService log;

    public ServiceService(ServiceRepository serviceRepository, LoggerService log) {
        this.serviceRepository = serviceRepository;
        this.log = log;
    }

    public ServiceDfcr createService(ServiceDto input) {
        ServiceDfcr service = new ServiceDfcr(
            input.getIdService(),
            input.getServiceName(),
            input.getAttribution(),
            input.getServiceEmail()
        );

        log.info("Création du service : " + input.getIdService());
        return serviceRepository.save(service);
    }

    public List<ServiceDfcr> getAllServices() {
        log.info("Récupération de tous les services");
        return serviceRepository.findAll();
    }

    public Optional<ServiceDfcr> getServiceById(String id) {
        log.info("Récupération du service : " + id);
        return serviceRepository.findById(id);
    }

    public ServiceDfcr updateService(String id, ServiceDto input) {
        Optional<ServiceDfcr> serviceOpt = serviceRepository.findById(id);
        if (serviceOpt.isEmpty()) {
            throw new RuntimeException("Service non trouvé avec id : " + id);
        }

        ServiceDfcr service = serviceOpt.get();
        service.setServiceName(input.getServiceName());
        service.setAttribution(input.getAttribution());
        service.setServiceEmail(input.getServiceEmail());

        log.info("Mise à jour du service : " + id);
        return serviceRepository.save(service);
    }

    public void deleteService(String id) {
        Optional<ServiceDfcr> serviceOpt = serviceRepository.findById(id);
        if (serviceOpt.isEmpty()) {
            throw new RuntimeException("Service non trouvé avec id : " + id);
        }

        serviceRepository.deleteById(id);
        log.info("Suppression du service : " + id);
    }
}

