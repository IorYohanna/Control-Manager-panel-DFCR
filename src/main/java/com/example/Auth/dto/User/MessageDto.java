package com.example.Auth.dto.User;

import java.time.LocalDateTime;
import com.example.Auth.model.User.Message;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageDto {
    private Long id;
    private String senderMatricule;
    private String senderName;
    private String receiverMatricule;
    private String receiverName;
    private String content;
    private LocalDateTime sentAt;

    public MessageDto(Message message) {
        this.id = message.getId();
        this.senderMatricule = message.getSender().getMatricule();
        this.receiverMatricule = message.getReceiver().getMatricule();
        this.senderName = message.getSender().getName();
        this.receiverName = message.getReceiver().getName();
        this.content = message.getContent();
        this.sentAt = message.getSentAt();
    }
}
