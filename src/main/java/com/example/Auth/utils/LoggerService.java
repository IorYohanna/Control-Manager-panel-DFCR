package com.example.Auth.utils;

import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class LoggerService {
    public void info(String message) {
        log.info("Info :  {}", message);
    }

    public void warn(String message) {
        log.warn("Warning : {}", message);
    }

    public void error(String message, Exception e) {
        log.error("Error : " + message, e);
    }

    public void success(String message) {
        log.info("Success : {}", message);
    }
}
