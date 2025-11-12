package com.example.Auth.service.User;

import com.example.Auth.model.User.Message;
import com.example.Auth.model.User.User;
import com.example.Auth.repository.User.MessageRepository;
import com.example.Auth.repository.User.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageService(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    public Message saveMessage(String senderMatricule, String receiverMatricule, String content) {
        User sender = userRepository.findById(senderMatricule).orElseThrow();
        User receiver = userRepository.findById(receiverMatricule).orElseThrow();

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content);
        message.setSentAt(LocalDateTime.now());

        return messageRepository.save(message);
    }

    public List<Message> getConversation(String user1Matricule, String user2Matricule) {
        User user1 = userRepository.findById(user1Matricule).orElseThrow();
        User user2 = userRepository.findById(user2Matricule).orElseThrow();

        return messageRepository.findBySenderAndReceiverOrReceiverAndSenderOrderBySentAt(
                user1, user2, user1, user2
        );
    }

    public Message getById(Long id) {
        return messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found with id: " + id));
    }

    public void deleteMessage(Long id) {
        messageRepository.deleteById(id);
    }

}
