package com.example.Auth.service.User;

import com.example.Auth.model.Document.Event;
import com.example.Auth.model.User.User;
import com.example.Auth.dto.User.UserDto;
import org.springframework.stereotype.Service;

import com.example.Auth.dto.User.ServiceDto;
import com.example.Auth.model.User.ServiceDfcr;
import com.example.Auth.repository.User.ServiceRepository;
import com.example.Auth.utils.LoggerService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
                input.getServiceEmail());

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

    public List<Event> getAllEvents(String id) {
        Optional<ServiceDfcr> serviceOpt = serviceRepository.findById(id);
        if (serviceOpt.isEmpty()) {
            throw new RuntimeException("Service non trouvé avec id : " + id);
        }

        ServiceDfcr service = serviceOpt.get();
        return service.getEvents();
    }

    /**
     * Récupère tous les utilisateurs d'un service
     */
    public List<UserDto> getUsersByService(String idService) {
        Optional<ServiceDfcr> serviceOpt = serviceRepository.findById(idService);
        if (serviceOpt.isEmpty()) {
            throw new RuntimeException("Service non trouvé avec id : " + idService);
        }

        ServiceDfcr service = serviceOpt.get();
        log.info("Récupération des utilisateurs du service : " + idService);

        // Convertir les utilisateurs en DTO
        return service.getUsers().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Convertit un User en UserDto
     */
    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setMatricule(user.getMatricule());
        dto.setUsername(user.getUsername());
        dto.setSurname(user.getSurname());
        dto.setEmail(user.getEmail());
        dto.setFonction(user.getFonction());
        dto.setContact(String.valueOf(user.getContact()));
        dto.setIdservice(user.getService() != null ? user.getService().getIdService() : null);
        dto.setScore(String.valueOf(user.getScore()));
        dto.setEvaluation(user.getEvaluation());
        return dto;
    }
}