package com.example.Auth.model.Document;

import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@EqualsAndHashCode
public class ConcernerId implements Serializable {
    private Long idDossier;
    private String reference;
}
