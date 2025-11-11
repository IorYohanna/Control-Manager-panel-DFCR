package com.example.Auth.dto.Workflow;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WorkRequest {
    private String reference;
    private String employeMatricule;
    private String chefMatricule; 
    private String remarque;
}
