package com.example.Auth.controller.workflow;

import com.example.Auth.dto.Workflow.*;
import com.example.Auth.model.User.ServiceDfcr;
import com.example.Auth.model.User.User;
import com.example.Auth.model.workflow.Workflow;
import com.example.Auth.repository.User.ServiceRepository;
import com.example.Auth.repository.User.UserRepository;
import com.example.Auth.service.workflow.WorkflowService;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/workflow")
@CrossOrigin(origins = "*")
public class WorkflowController {

        @Autowired
        private WorkflowService workflowService;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private ServiceRepository serviceRepository;

        // Dans votre WorkflowController

        @PostMapping("/send-to-service")
        public ResponseEntity<?> sendToService(@RequestBody SendToServiceRequest request) {
                try {
                        User directeur = userRepository.findById(request.getDirecteurMatricule())
                                        .orElseThrow(() -> new RuntimeException("Directeur non trouvé"));

                        List<String> serviceIds = request.getServiceIdsAsList();

                        if (serviceIds.isEmpty()) {
                                return ResponseEntity.badRequest()
                                                .body(Map.of("message", "Aucun service sélectionné"));
                        }

                        List<ServiceDfcr> services = serviceIds.stream()
                                        .map(id -> serviceRepository.findById(id)
                                                        .orElseThrow(() -> new RuntimeException(
                                                                        "Service non trouvé: " + id)))
                                        .collect(Collectors.toList());

                        if (services.size() == 1) {
                                workflowService.directeurEnvoieService(
                                                request.getReference(),
                                                directeur,
                                                services.get(0),
                                                request.getTypeWorkflow(),
                                                request.getRemarque());
                                return ResponseEntity.ok(Map.of(
                                                "message", "Document envoyé au service avec succès",
                                                "success", true));
                        } else {
                                workflowService.directeurEnvoieServices(
                                                request.getReference(),
                                                directeur,
                                                services,
                                                request.getTypeWorkflow(),
                                                request.getRemarque());
                                return ResponseEntity.ok(Map.of(
                                                "message",
                                                "Document envoyé à " + services.size() + " services avec succès",
                                                "success", true,
                                                "count", services.size()));
                        }

                } catch (Exception e) {
                        return ResponseEntity.badRequest()
                                        .body(Map.of("message", e.getMessage(), "success", false));
                }
        }

        @PostMapping("/assign-to-employe")
        public ResponseEntity<?> assignToEmploye(@RequestBody AssignRequest request) {
                try {
                        User chef = userRepository.findById(request.getChefMatricule())
                                        .orElseThrow(() -> new RuntimeException("Chef non trouvé"));

                        List<String> employeMatricules = request.getEmployeMatriculesAsList();

                        if (employeMatricules.isEmpty()) {
                                return ResponseEntity.badRequest()
                                                .body(Map.of("message", "Aucun employé sélectionné"));
                        }

                        List<User> employes = employeMatricules.stream()
                                        .map(matricule -> userRepository.findById(matricule)
                                                        .orElseThrow(() -> new RuntimeException(
                                                                        "Employé non trouvé: " + matricule)))
                                        .collect(Collectors.toList());

                        if (employes.size() == 1) {
                                workflowService.chefAssigneEmploye(
                                                request.getReference(),
                                                chef,
                                                employes.get(0),
                                                request.getRemarque());
                                return ResponseEntity.ok(Map.of(
                                                "message", "Document assigné à l'employé avec succès",
                                                "success", true));
                        } else {
                                workflowService.chefAssigneEmployes(
                                                request.getReference(),
                                                chef,
                                                employes,
                                                request.getRemarque());
                                return ResponseEntity.ok(Map.of(
                                                "message",
                                                "Document assigné à " + employes.size() + " employés avec succès",
                                                "success", true,
                                                "count", employes.size()));
                        }

                } catch (Exception e) {
                        return ResponseEntity.badRequest()
                                        .body(Map.of("message", e.getMessage(), "success", false));
                }
        }

        /**
         * 3. Employé commence le traitement
         */
        @PostMapping("/start-work")
        public ResponseEntity<WorkflowResponse> startWork(@RequestBody WorkRequest request) {
                try {
                        User employe = userRepository.findById(request.getEmployeMatricule())
                                        .orElseThrow(() -> new RuntimeException("Employé non trouvé"));

                        Workflow workflow = workflowService.employeCommenceTraitement(
                                        request.getReference(),
                                        employe);

                        return ResponseEntity.ok(new WorkflowResponse(
                                        true,
                                        "Traitement commencé",
                                        workflow));

                } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(new WorkflowResponse(false, e.getMessage()));
                }
        }

        /**
         * 4. Employé termine et envoie au chef
         */
        @PostMapping("/finish-work")
        public ResponseEntity<WorkflowResponse> finishWork(@RequestBody WorkRequest request) {
                try {
                        User employe = userRepository.findById(request.getEmployeMatricule())
                                        .orElseThrow(() -> new RuntimeException("Employé non trouvé"));

                        User chefService = userRepository.findById(request.getChefMatricule())
                                        .orElseThrow(() -> new RuntimeException("Chef de service non trouvé"));

                        Workflow workflow = workflowService.employeTermineEtEnvoie(
                                        request.getReference(),
                                        employe,
                                        chefService,
                                        request.getRemarque());

                        return ResponseEntity.ok(new WorkflowResponse(
                                        true,
                                        "Document terminé et envoyé au chef",
                                        workflow));

                } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(new WorkflowResponse(false, e.getMessage()));
                }
        }

        /**
         * 5. Chef valide et envoie au directeur
         */
        @PostMapping("/chef-validate")
        public ResponseEntity<WorkflowResponse> chefValidate(@RequestBody ChefActionRequest request) {
                try {
                        User chefService = userRepository.findById(request.getChefMatricule())
                                        .orElseThrow(() -> new RuntimeException("Chef de service non trouvé"));

                        User directeur = userRepository.findById(request.getDirecteurMatricule())
                                        .orElseThrow(() -> new RuntimeException("Directeur non trouvé"));

                        Workflow workflow = workflowService.chefValideEtEnvoieDirecteur(
                                        request.getReference(),
                                        chefService,
                                        directeur,
                                        request.getRemarque());

                        return ResponseEntity.ok(new WorkflowResponse(
                                        true,
                                        "Document validé et envoyé au directeur",
                                        workflow));

                } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(new WorkflowResponse(false, e.getMessage()));
                }
        }

        /**
         * 6. Chef refuse le document
         */
        @PostMapping("/chef-reject")
        public ResponseEntity<WorkflowResponse> chefReject(@RequestBody ChefActionRequest request) {
                try {
                        User chefService = userRepository.findById(request.getChefMatricule())
                                        .orElseThrow(() -> new RuntimeException("Chef de service non trouvé"));

                        User employe = userRepository.findById(request.getEmployeMatricule())
                                        .orElseThrow(() -> new RuntimeException("Employé non trouvé"));

                        Workflow workflow = workflowService.chefRefuseDocument(
                                        request.getReference(),
                                        chefService,
                                        employe,
                                        request.getRemarque());

                        return ResponseEntity.ok(new WorkflowResponse(
                                        true,
                                        "Document refusé et renvoyé à l'employé",
                                        workflow));

                } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(new WorkflowResponse(false, e.getMessage()));
                }
        }

        /**
         * 7. Directeur valide comme complet
         */
        @PostMapping("/directeur-validate")
        public ResponseEntity<WorkflowResponse> directeurValidate(@RequestBody DirecteurActionRequest request) {
                try {
                        User directeur = userRepository.findById(request.getDirecteurMatricule())
                                        .orElseThrow(() -> new RuntimeException("Directeur non trouvé"));

                        Workflow workflow = workflowService.directeurValideComplet(
                                        request.getReference(),
                                        directeur,
                                        request.getRemarque());

                        return ResponseEntity.ok(new WorkflowResponse(
                                        true,
                                        "Document validé comme complet",
                                        workflow));

                } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(new WorkflowResponse(false, e.getMessage()));
                }
        }

        /**
         * 8. Directeur refuse (incomplet)
         */
        @PostMapping("/directeur-reject")
        public ResponseEntity<WorkflowResponse> directeurReject(@RequestBody DirecteurActionRequest request) {
                try {
                        User directeur = userRepository.findById(request.getDirecteurMatricule())
                                        .orElseThrow(() -> new RuntimeException("Directeur non trouvé"));

                        ServiceDfcr service = serviceRepository.findById(request.getServiceId())
                                        .orElseThrow(() -> new RuntimeException("Service non trouvé"));

                        Workflow workflow = workflowService.directeurRefuseIncomplet(
                                        request.getReference(),
                                        directeur,
                                        service,
                                        request.getRemarque());

                        return ResponseEntity.ok(new WorkflowResponse(
                                        true,
                                        "Document refusé et renvoyé au service",
                                        workflow));

                } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(new WorkflowResponse(false, e.getMessage()));
                }
        }

        @GetMapping("/history/{reference}")
        public ResponseEntity<List<WorkflowHistoriqueDTO>> getWorkflowHistory(@PathVariable String reference) {
                List<WorkflowHistoriqueDTO> history = workflowService.getWorkflowHistory(reference);
                if (history.isEmpty()) {
                        return ResponseEntity.noContent().build();
                }
                return ResponseEntity.ok(history);
        }

        @GetMapping("/history")
        public ResponseEntity<List<WorkflowHistoriqueDTO>> getAllWorkflowHistories() {
                List<WorkflowHistoriqueDTO> history = workflowService.getAllWorkflowHistories();
                if (history.isEmpty()) {
                        return ResponseEntity.noContent().build();
                }
                return ResponseEntity.ok(history);
        }

}