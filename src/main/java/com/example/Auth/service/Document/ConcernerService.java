package com.example.Auth.service.Document;

import com.example.Auth.model.Document.Concerner;
import com.example.Auth.repository.Document.ConcernerRepository;
import com.example.Auth.repository.Document.DocumentRepository;
import com.example.Auth.repository.Document.DossierRepository;
import org.springframework.stereotype.Service;

@Service
public class ConcernerService {
    private final ConcernerRepository concernerRepository;
    private final DossierRepository dossierRepository;
    private final DocumentRepository documentRepository;

    public ConcernerService(ConcernerRepository concernerRepository, DossierRepository dossierRepository,
            DocumentRepository documentRepository) {
        this.concernerRepository = concernerRepository;
        this.dossierRepository = dossierRepository;
        this.documentRepository = documentRepository;
    }
}
