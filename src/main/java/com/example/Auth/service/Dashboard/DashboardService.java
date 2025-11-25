package com.example.Auth.service.Dashboard;

import com.example.Auth.dto.Dashboard.ServiceStatisticsDto;
import com.example.Auth.dto.Dashboard.UserInfoDto;
import com.example.Auth.model.workflow.Workflow;
import com.example.Auth.model.User.ServiceDfcr;
import com.example.Auth.repository.User.ServiceRepository;
import com.example.Auth.repository.workflow.WorkflowHistoriqueRepository;
import com.example.Auth.service.workflow.WorkflowService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;

@Service
@AllArgsConstructor
public class DashboardService {
    private final ServiceRepository serviceRepository;
    private final WorkflowHistoriqueRepository workflowHistoriqueRepository;
    private final WorkflowService workflowService;

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

    public List<Map<String, Object>> getMonthlyStats(int year,String idService) {
        List<Object[]> rows = workflowHistoriqueRepository.getMonthlyStats(year, idService);

        List<Map<String, Object>> result = new ArrayList<>();

        for (Object[] row : rows) {
            int month = ((Integer) row[0]);

            Map<String, Object> map = new HashMap<>();
            map.put("month", Month.of(month).getDisplayName(TextStyle.FULL, Locale.ENGLISH));
            map.put("refused", row[1]);
            map.put("completed", row[2]);

            result.add(map);
        }

        return result;
    }

}
