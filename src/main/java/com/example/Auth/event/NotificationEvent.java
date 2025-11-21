package com.example.Auth.event;

import com.example.Auth.model.User.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class NotificationEvent {
    private String type;
    private User sender;
    private User receiver;
    private Object data;
}
