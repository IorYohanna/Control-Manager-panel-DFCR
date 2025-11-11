package com.example.Auth.dto.Workflow;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WorkflowResponse {
    private boolean success;
    private String message;
    private Object data;
    
    public WorkflowResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
}
