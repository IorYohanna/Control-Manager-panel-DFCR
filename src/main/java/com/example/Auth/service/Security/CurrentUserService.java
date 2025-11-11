package com.example.Auth.service.Security;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.Auth.model.User.ServiceDfcr;
import com.example.Auth.model.User.User;
import com.example.Auth.repository.User.UserRepository;

@Service
public class CurrentUserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserServiceInfoService userServiceInfoService;

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        return userRepository.findByMatricule(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    public Map<String, Object> getProfile() {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        response.put("matricule", user.getMatricule());
        response.put("username", user.getName());
        response.put("email", user.getEmail());
        response.put("surname", user.getSurname());
        response.put("contact", user.getContact());
        response.put("fonction", user.getFonction());
        response.put("createdAt", user.getCreatedAt());
        response.put("score", user.getScore());
        response.put("evaluation", user.getEvaluation());

        if (user.getService() != null) {
            ServiceDfcr service = user.getService();
            Map<String, Object> serviceInfo = new HashMap<>();
            serviceInfo.put("idService", service.getIdService());
            serviceInfo.put("serviceName", service.getServiceName());
            serviceInfo.put("attribution", service.getAttribution());
            serviceInfo.put("serviceEmail", service.getServiceEmail());
            response.put("service", serviceInfo);
        }

        return response;
    }

    public Map<String, Object> getBasicInfo() {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        response.put("matricule", user.getMatricule());
        response.put("username", user.getName());
        response.put("email", user.getEmail());
        response.put("fullName", user.getSurname() + " " + user.getName());
        response.put("fonction", user.getFonction());
        response.put("photoProfil", user.getPhotoProfil());

        return response;
    }

    public String getFullName() {
        User user = getAuthenticatedUser();
        return user.getSurname() + " " + user.getName();
    }

    public String getEmail() {
        return getAuthenticatedUser().getEmail();
    }

    public String getRole() {
        return getAuthenticatedUser().getFonction();
    }
    public String getMatricule() {
        return getAuthenticatedUser().getMatricule();
    }

    public Map<String, Object> getServiceInfo() {
        ServiceDfcr service = userServiceInfoService.getCurrentUserService();
        Map<String, Object> response = new HashMap<>();

        response.put("idService", service.getIdService());
        response.put("serviceName", service.getServiceName());
        response.put("attribution", service.getAttribution());
        response.put("serviceEmail", service.getServiceEmail());
        response.put("userCount", service.getUserCount());
        response.put("eventCount", service.getEventCount());

        return response;
    }

    public int getUserCount() {
        return userServiceInfoService.getCurrentUserServiceUserCount();
    }

    public int getEventCount() {
        return userServiceInfoService.getCurrentUserServiceEventCount();
    }

    public Map<String, Object> getDashboard() {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        Map<String, Object> userInfo = getBasicInfo();
        response.put("user", userInfo);

        if (user.getService() != null) {
            ServiceDfcr service = user.getService();
            Map<String, Object> serviceInfo = new HashMap<>();
            serviceInfo.put("idService", service.getIdService());
            serviceInfo.put("serviceName", service.getServiceName());
            serviceInfo.put("attribution", service.getAttribution());
            serviceInfo.put("serviceEmail", service.getServiceEmail());
            serviceInfo.put("userCount", service.getUserCount());
            serviceInfo.put("eventCount", service.getEventCount());
            response.put("service", serviceInfo);
        }

        return response;
    }

    public boolean hasService() {
        return getAuthenticatedUser().getService() != null;
    }
}
