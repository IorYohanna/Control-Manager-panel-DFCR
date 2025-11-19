package com.example.Auth.model.Document;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "concerner")
@Getter
@Setter
public class Concerner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_dossier", referencedColumnName = "id_dossier")
    private Dossier dossier;

    @ManyToOne
    @JoinColumn(name = "reference_document", referencedColumnName = "reference")
    private Document document;

    public Concerner() {
    }

    public Concerner(Dossier dossier, Document document) {
        this.dossier = dossier;
        this.document = document;
    }
}
