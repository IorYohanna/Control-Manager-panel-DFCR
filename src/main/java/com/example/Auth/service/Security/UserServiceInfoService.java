package com.example.Auth.service.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.example.Auth.model.User.User;
import com.example.Auth.repository.User.UserRepository;
import com.example.Auth.model.User.ServiceDfcr;

@Service
public class UserServiceInfoService {
    
    @Autowired
    private UserRepository userRepository;
    
    public ServiceDfcr getCurrentUserService() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        User currentUser = userRepository.findByMatricule(username)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        if (currentUser.getService() == null) {
            throw new RuntimeException("L'utilisateur n'appartient à aucun service");
        }
        
        return currentUser.getService();
    }
    
    public int getCurrentUserServiceUserCount() {
        ServiceDfcr service = getCurrentUserService();
        return service.getUserCount(); 
    }
    
    public int getCurrentUserServiceEventCount() {
        ServiceDfcr service = getCurrentUserService();
        return service.getEventCount();
    }
}