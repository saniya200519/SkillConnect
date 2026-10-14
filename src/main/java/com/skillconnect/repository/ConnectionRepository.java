package com.skillconnect.repository;

import com.skillconnect.entity.Connection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConnectionRepository extends JpaRepository<Connection, Long> {

    List<Connection> findByReceiverId(Long receiverId);

    List<Connection> findBySenderId(Long senderId);

    boolean existsBySenderIdAndReceiverId(Long senderId, Long receiverId);
    List<Connection> findBySenderIdOrReceiverId(Long senderId, Long receiverId);
    boolean existsBySenderIdAndReceiverIdOrSenderIdAndReceiverId(
            Long senderId1,
            Long receiverId1,
            Long senderId2,
            Long receiverId2
    );
}