package com.example.Auth.dto;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;

import com.example.Auth.model.Document.Event;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EventResponseDto {
    private Long idEvent;
    private String title;
    private String description;
    private String startTime;
    private String endTime;
    private boolean allDay;
    private String email;
    private String userName;
    private String service;


    public EventResponseDto(Event event) {
        this.idEvent = event.getIdEvent();
        this.title = event.getTitle();
        this.description = event.getDescription();
        this.startTime = event.getStartTime().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
        this.endTime = event.getEndTime().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
        this.allDay = event.isAllDay();
        this.email = event.getEmail();
        this.userName = event.getCreatedBy().getName();
        this.service = event.getService().getIdService();
    }

}
