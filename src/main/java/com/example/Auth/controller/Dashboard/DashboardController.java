package com.example.Auth.controller.Dashboard;

import com.example.Auth.dto.Dashboard.ServiceStatisticsDto;
import com.example.Auth.dto.Dashboard.WorkflowStatisticsDto;
import com.example.Auth.dto.Workflow.WorkflowHistorique;
import com.example.Auth.model.Document.Workflow;
import com.example.Auth.service.Dashboard.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

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

    @GetMapping("/service/{idService}")
    public ResponseEntity<WorkflowStatisticsDto> getWorkflowStatistics(@PathVariable String idService) {
        WorkflowStatisticsDto stats = new WorkflowStatisticsDto();

        List<Workflow> workflows = dashboardService.getWorkflowService(idService.toUpperCase(), null);
        stats.setTotalWorkflows(workflows.size());
        stats.setEnAttente((int) workflows.stream().filter(w -> "en_attente".equals(w.getStatus())).count());
        stats.setAuService((int) workflows.stream().filter(w -> "au_service".equals(w.getStatus())).count());
        stats.setAssigne((int) workflows.stream().filter(w -> "assigne".equals(w.getStatus())).count());
        stats.setEnTraitement((int) workflows.stream().filter(w -> "en_traitement".equals(w.getStatus())).count());
        stats.setTermine((int) workflows.stream().filter(w -> "termine".equals(w.getStatus())).count());
        stats.setValidationDirecteur((int) workflows.stream().filter(w -> "validation_directeur".equals(w.getStatus())).count());
        stats.setComplet((int) workflows.stream().filter(w -> "complet".equals(w.getStatus())).count());

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/workflows/{idService}/{status}")
    public ResponseEntity<List<WorkflowHistorique>> getWorkflowService(
            @PathVariable String idService,
            @PathVariable String status
    ) {
        System.out.println("ID SERVICE = " + idService + " | STATUS = " + status);
        List<Workflow> workflows = dashboardService.getWorkflowService(idService.toUpperCase(), status);
        List<WorkflowHistorique> workflowHistoriques = workflows.stream().map(workflow -> {
            WorkflowHistorique dto = new WorkflowHistorique();
            dto.setReference(workflow.getDocument().getReference());
            dto.setTypeWorkflow(workflow.getTypeWorkflow());
            dto.setAction(workflow.getAction());
            dto.setStatus(workflow.getStatus());
            dto.setMatriculeActeur(workflow.getActeur().getMatricule());
            dto.setActeurFonction(workflow.getActeur().getFonction());
            dto.setRemarque(workflow.getRemarque());
            dto.setEstComplet(workflow.getEstComplet());
            dto.setCreatedAt(workflow.getCreatedAt());
            return dto;
        }).toList();

        return ResponseEntity.ok(workflowHistoriques);
    }
}
