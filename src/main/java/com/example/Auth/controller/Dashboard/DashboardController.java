package com.example.Auth.controller.Dashboard;

import com.example.Auth.dto.Dashboard.ServiceStatisticsDto;
import com.example.Auth.service.Dashboard.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/{idService}")
    public ResponseEntity<ServiceStatisticsDto> getServiceStatistics(@PathVariable String idService) {

        return ResponseEntity.ok(dashboardService.getServiceStatistics(idService.toUpperCase()));
    }
}
