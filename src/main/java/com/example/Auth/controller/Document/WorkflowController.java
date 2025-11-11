package com.example.Auth.controller.Document;

import com.example.Auth.dto.Workflow.*;
import com.example.Auth.model.Document.Workflow;
import com.example.Auth.model.User.ServiceDfcr;
import com.example.Auth.model.User.User;
import com.example.Auth.repository.User.ServiceRepository;
import com.example.Auth.repository.User.UserRepository;
import com.example.Auth.service.Document.WorkflowService;

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

    /**
     * 1. Directeur envoie le document à un service
     */
    @PostMapping("/send-to-service")
    public ResponseEntity<WorkflowResponse> sendToService(@RequestBody SendToServiceRequest request) {
        try {
            // Récupérer les entités
            User directeur = userRepository.findById(request.getDirecteurMatricule())
                .orElseThrow(() -> new RuntimeException("Directeur non trouvé"));
            
            ServiceDfcr service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service non trouvé"));
            
            // Appeler le service
            Workflow workflow = workflowService.directeurEnvoieService(
                request.getReference(),
                directeur,
                service,
                request.getTypeWorkflow(),
                request.getRemarque()
            );
            
            return ResponseEntity.ok(new WorkflowResponse(
                true,
                "Document envoyé au service avec succès",
                workflow
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new WorkflowResponse(false, e.getMessage()));
        }
    }

    /**
     * 2. Chef de service assigne à un employé
     */
    @PostMapping("/assign-to-employe")
    public ResponseEntity<WorkflowResponse> assignToEmploye(@RequestBody AssignRequest request) {
        try {
            User chefService = userRepository.findById(request.getChefMatricule())
                .orElseThrow(() -> new RuntimeException("Chef de service non trouvé"));
            
            User employe = userRepository.findById(request.getEmployeMatricule())
                .orElseThrow(() -> new RuntimeException("Employé non trouvé"));
            
            Workflow workflow = workflowService.chefAssigneEmploye(
                request.getReference(),
                chefService,
                employe,
                request.getRemarque()
            );
            
            return ResponseEntity.ok(new WorkflowResponse(
                true,
                "Document assigné à l'employé avec succès",
                workflow
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new WorkflowResponse(false, e.getMessage()));
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
                employe
            );
            
            return ResponseEntity.ok(new WorkflowResponse(
                true,
                "Traitement commencé",
                workflow
            ));
            
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
                request.getRemarque()
            );
            
            return ResponseEntity.ok(new WorkflowResponse(
                true,
                "Document terminé et envoyé au chef",
                workflow
            ));
            
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
                request.getRemarque()
            );
            
            return ResponseEntity.ok(new WorkflowResponse(
                true,
                "Document validé et envoyé au directeur",
                workflow
            ));
            
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
                request.getRemarque()
            );
            
            return ResponseEntity.ok(new WorkflowResponse(
                true,
                "Document refusé et renvoyé à l'employé",
                workflow
            ));
            
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
                request.getRemarque()
            );
            
            return ResponseEntity.ok(new WorkflowResponse(
                true,
                "Document validé comme complet",
                workflow
            ));
            
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
                request.getRemarque()
            );
            
            return ResponseEntity.ok(new WorkflowResponse(
                true,
                "Document refusé et renvoyé au service",
                workflow
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new WorkflowResponse(false, e.getMessage()));
        }
    }

    /**
     * Récupérer l'historique des workflows d'un document
     */
    @GetMapping("/history/{reference}")
    public ResponseEntity<WorkflowResponse> getWorkflowHistory(@PathVariable String reference) {
        try {
            // À implémenter dans WorkflowService
            return ResponseEntity.ok(new WorkflowResponse(
                true,
                "Historique récupéré",
                null
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new WorkflowResponse(false, e.getMessage()));
        }
    }
}