package com.example.Auth.service.Dashboard;

import com.example.Auth.dto.Dashboard.ServiceStatisticsDto;
import com.example.Auth.dto.Dashboard.UserInfoDto;
import com.example.Auth.model.User.ServiceDfcr;
import com.example.Auth.repository.User.ServiceRepository;
import com.example.Auth.repository.User.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;

    public DashboardService(UserRepository userRepository, ServiceRepository serviceRepository) {
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
    }

    public ServiceStatisticsDto getServiceStatistics(String idService) {
        ServiceDfcr service = serviceRepository.findById(idService)
                .orElseThrow(() -> new RuntimeException("Service non trouvé avec id : " + idService));

        List<UserInfoDto> users = service.getUsers().stream()
                .map(user -> new UserInfoDto(
                        user.getMatricule(),
                        user.getName(),
                        user.getSurname(),
                        user.getFonction(),
                        user.getPhotoProfil()))
                .toList();
        return new ServiceStatisticsDto(
                service.getServiceName(),
                service.getUserCount(),
                service.getEventCount(),
                users
        );  
    }
}
