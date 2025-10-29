package com.example.Auth.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;

@Service
public class DateUtilsService {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    public String nowAsString() {
        return LocalDateTime.now().format(FORMATTER);
    }

    public String format(LocalDateTime dateTime) {
        return (dateTime != null) ? dateTime.format(FORMATTER) : null;
    }

    public LocalDateTime now() {
        return LocalDateTime.now();
    }
}
