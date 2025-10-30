package com.example.Auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
@AllArgsConstructor
public class EventDto {
    private String title;
    private String description;
    private OffsetDateTime startTime;
    private OffsetDateTime endTime;
    private boolean allDay;
    private String color;
    private String email;
    private String userName;

    public boolean getAllDay() {
        return allDay;
    }
}
