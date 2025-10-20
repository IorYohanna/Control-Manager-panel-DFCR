package com.example.dfcr.services;

import com.example.dfcr.dto.UtilisateurResponse;
import com.example.dfcr.models.Utilisateur;
import com.example.dfcr.repositories.UtilisateurRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Service
public class UtilisateurService implements UserDetailsService {
    private final UtilisateurRepository utilisateurRepository;

    public UtilisateurService(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }


    @Override
    public UserDetails loadUserByUsername(String matricule) throws UsernameNotFoundException {
        return utilisateurRepository.findByMatricule(matricule)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec le matricule: " + matricule));
    }

    public Utilisateur save (Utilisateur newUser) {
        return utilisateurRepository.save(newUser);
    }

    public List<UtilisateurResponse> getAllUsers() {
        return utilisateurRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    public Optional<UtilisateurResponse> getUserByMatricule(@PathVariable String matricule) {
        return utilisateurRepository
                .findByMatricule(matricule)
                .map(this::mapToDto);
    }

    public UtilisateurResponse updateUser(@PathVariable String matricule, @RequestBody UtilisateurResponse utilisateur){
        return utilisateurRepository.findByMatricule(matricule)
                .map(u -> {
                    u.setNomUtilisateur(utilisateur.getNomUtilisateur());
                    u.setPrenomUtilisateur(utilisateur.getPrenomUtilisateur());
                    u.setFonction(utilisateur.getFonction());
                    u.setContact(utilisateur.getContact());
                    u.setEmail(utilisateur.getEmail());
                    u = utilisateurRepository.save(u);
                    return mapToDto(u);
                })
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    public boolean deleteUserByMatricule(@PathVariable String matricule){
        if(utilisateurRepository.existsById(matricule)){
            utilisateurRepository.deleteById(matricule);
            return true;
        }
        return false;
    }

    private UtilisateurResponse mapToDto(Utilisateur u) {
        List<String> roles = u.getAuthorities() != null ?
                u.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .toList() : List.of();
        return UtilisateurResponse.builder()
                .matricule(u.getMatricule())
                .nomUtilisateur(u.getNomUtilisateur())
                .prenomUtilisateur(u.getPrenomUtilisateur())
                .email(u.getEmail())
                .contact(u.getContact())
                .idService(u.getIdService())
                .idPefa(u.getIdPefa())
                .fonction(u.getFonction())
                .roles(roles)
                .build();
    }

}
