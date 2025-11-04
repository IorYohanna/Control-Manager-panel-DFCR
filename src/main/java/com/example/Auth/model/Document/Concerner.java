package com.example.Auth.model.Document;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "concerner")
@Getter
@Setter
public class Concerner {

    @EmbeddedId
    private ConcernerId id = new ConcernerId();

    @ManyToOne
    @MapsId("idDossier")
    @JoinColumn(name = "id_dossier")
    private Dossier dossier;

    @ManyToOne
    @MapsId("reference")
    @JoinColumn(name = "reference")
    private Document document;

    public Concerner() {
    }

    public Concerner(Dossier dossier, Document document) {
        this.dossier = dossier;
        this.document = document;
        this.id.setIdDossier(dossier.getIdDossier());
        this.id.setReference(document.getReference());
    }
}
