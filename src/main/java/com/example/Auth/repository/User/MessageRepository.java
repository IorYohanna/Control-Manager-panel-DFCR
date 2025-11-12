package com.example.Auth.repository.User;

import com.example.Auth.model.User.Message;
import com.example.Auth.model.User.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderAndReceiverOrReceiverAndSenderOrderBySentAt(
            User sender1, User receiver1, User sender2, User receiver2
    );
}