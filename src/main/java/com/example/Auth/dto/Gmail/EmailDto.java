package com.example.Auth.dto.Gmail;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmailDto {
    private String id;
    private String from;
    private String subject;
    private String snippet;
    private String date;
    private String body;
}