package com.example.Auth.controller.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Auth.model.User.ServiceDfcr;
import com.example.Auth.service.Security.UserServiceInfoService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/current-user")    
@CrossOrigin(origins = "http://localhost:5173")

public class CurrentUserServiceController {
    
    @Autowired
    private UserServiceInfoService userServiceInfoService;
    
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getCurrentUserServiceInfo() {
        ServiceDfcr service = userServiceInfoService.getCurrentUserService();
        
        Map<String, Object> response = new HashMap<>();
        response.put("idService", service.getIdService());
        response.put("serviceName", service.getServiceName());
        response.put("attribution", service.getAttribution());
        response.put("serviceEmail", service.getServiceEmail());
        response.put("userCount", service.getUserCount());  
        response.put("eventCount", service.getEventCount()); 
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user-count")
    public ResponseEntity<Integer> getUserCount() {
        int count = userServiceInfoService.getCurrentUserServiceUserCount();
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/event-count")
    public ResponseEntity<Integer> getEventCount() {
        int count = userServiceInfoService.getCurrentUserServiceEventCount();
        return ResponseEntity.ok(count);
    }
}