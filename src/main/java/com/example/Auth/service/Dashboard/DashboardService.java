package com.example.Auth.service.Dashboard;

import com.example.Auth.dto.Dashboard.ServiceStatisticsDto;
import com.example.Auth.dto.Dashboard.UserInfoDto;
import com.example.Auth.model.Document.Workflow;
import com.example.Auth.model.User.ServiceDfcr;
import com.example.Auth.repository.User.ServiceRepository;
import com.example.Auth.service.Document.WorkflowService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class DashboardService {
    private final ServiceRepository serviceRepository;
    private final WorkflowService workflowService;

    public DashboardService(ServiceRepository serviceRepository, WorkflowService workflowService) {
        this.serviceRepository = serviceRepository;
        this.workflowService = workflowService;
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

    public List<Workflow> getWorkflowService (String idService, String status){
        return workflowService.getDocumentsService(idService, status);
    }
}
