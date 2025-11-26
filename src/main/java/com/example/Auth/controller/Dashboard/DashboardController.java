package com.example.Auth.controller.Dashboard;

import com.example.Auth.dto.Dashboard.CompletedDocumentDto;
import com.example.Auth.dto.Dashboard.ServiceStatisticsDto;
import com.example.Auth.dto.Dashboard.WorkflowStatisticsDto;
import com.example.Auth.dto.Workflow.WorkflowHistoriqueDTO;
import com.example.Auth.model.workflow.Workflow;
import com.example.Auth.service.Dashboard.DashboardService;
import com.example.Auth.service.workflow.WorkflowService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;
    private final WorkflowService workflowService;

    public DashboardController(DashboardService dashboardService, WorkflowService workflowService) {
        this.dashboardService = dashboardService;
        this.workflowService = workflowService;
    }

    @GetMapping("/{idService}")
    public ResponseEntity<ServiceStatisticsDto> getServiceStatistics(@PathVariable String idService) {

        return ResponseEntity.ok(dashboardService.getServiceStatistics(idService.toUpperCase()));
    }

    @GetMapping("/service/{idService}")
    public ResponseEntity<WorkflowStatisticsDto> getWorkflowStatistics(@PathVariable String idService) {
        WorkflowStatisticsDto stats = new WorkflowStatisticsDto();

        List<Workflow> workflows = dashboardService.getWorkflowService(idService.toUpperCase(), null);
        List<Workflow> workflowEnAttente = workflowService.getDocumentsEnAttente();

        stats.setTotalWorkflows(workflows.size());
        stats.setEnAttente((int) workflowEnAttente.size());
        stats.setAuService((int) workflows.stream().filter(w -> "au_service".equals(w.getStatus())).count());
        stats.setAssigne((int) workflows.stream().filter(w -> "assigne".equals(w.getStatus())).count());
        stats.setEnTraitement((int) workflows.stream().filter(w -> "en_traitement".equals(w.getStatus())).count());
        stats.setTermine((int) workflows.stream().filter(w -> "termine".equals(w.getStatus())).count());
        stats.setValidationDirecteur((int) workflows.stream().filter(w -> "validation_directeur".equals(w.getStatus())).count());
        stats.setComplet((int) workflows.stream().filter(w -> "complet".equals(w.getStatus())).count());

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/workflows/{idService}/{status}")
    public ResponseEntity<List<WorkflowHistoriqueDTO>> getWorkflowService(
            @PathVariable String idService,
            @PathVariable String status
    ) {
        System.out.println("ID SERVICE = " + idService + " | STATUS = " + status);
        List<Workflow> workflows = dashboardService.getWorkflowService(idService.toUpperCase(), status);
        List<WorkflowHistoriqueDTO> workflowHistoriques = workflows.stream().map(workflow -> {
            WorkflowHistoriqueDTO dto = new WorkflowHistoriqueDTO();
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

    @GetMapping("/history/service/{idService}")
    public ResponseEntity<List<WorkflowHistoriqueDTO>> getWorkflowHistoryByService(
            @PathVariable String idService
    ) {
        List<WorkflowHistoriqueDTO> history = workflowService.getWorkflowHistoryByService(idService);

        if (history.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(history);
    }

    @GetMapping("/workflow/stats/{idService}/{year}")
    public ResponseEntity<List<Map<String, Object>>> stats(@PathVariable String idService, @PathVariable int year) {
        return ResponseEntity.ok(dashboardService.getMonthlyStats(year, idService));
    }

    @GetMapping("/workflow/completed/{idService}")
    public ResponseEntity<List<CompletedDocumentDto>> getCompletedDocuments(
            @PathVariable String idService,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {

        List<CompletedDocumentDto> documents = workflowService.getCompletedDocumentsByService(
                idService, month, year
        );

        return ResponseEntity.ok(documents);
    }

}
