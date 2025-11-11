package com.example.Auth.dto.Workflow;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AssignRequest {
    private String reference;
    private String chefMatricule;
    private String employeMatricule;
    private String remarque;
}
