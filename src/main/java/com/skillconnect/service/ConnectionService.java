package com.skillconnect.service;

import com.skillconnect.entity.Connection;
import com.skillconnect.entity.Notification;
import com.skillconnect.entity.User;
import com.skillconnect.repository.ConnectionRepository;
import com.skillconnect.repository.NotificationRepository;
import com.skillconnect.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConnectionService {

    private final ConnectionRepository connections;
    private final UserRepository users;
    private final NotificationRepository notifications;

    public ConnectionService(
            ConnectionRepository connections,
            UserRepository users,
            NotificationRepository notifications) {
        this.connections = connections;
        this.users = users;
        this.notifications = notifications;
    }

    public Connection sendConnectionRequest(
            Long senderId, Long receiverId, String email) {

        User current = currentUser(email);

        if (!current.getId().equals(senderId))
            throw new AccessDeniedException(
                    "You can send requests only as yourself");

        if (senderId.equals(receiverId))
            throw new IllegalArgumentException(
                    "You cannot connect with yourself");

        User receiver = users.findById(receiverId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Receiver not found"));

        boolean exists = connections
                .findBySenderIdOrReceiverId(senderId, senderId)
                .stream()
                .anyMatch(c -> {
                    Long s = c.getSender().getId();
                    Long r = c.getReceiver().getId();

                    boolean samePair =
                            (s.equals(senderId) && r.equals(receiverId))
                            || (s.equals(receiverId) && r.equals(senderId));

                    return samePair
                            && ("PENDING".equals(c.getStatus())
                            || "ACCEPTED".equals(c.getStatus()));
                });

        if (exists)
            throw new IllegalArgumentException(
                    "A pending request or connection already exists");

        Connection c = new Connection();
        c.setSender(current);
        c.setReceiver(receiver);
        c.setStatus("PENDING");

        Connection savedConnection = connections.save(c);

        Notification notification = new Notification();
        notification.setMessage(
                current.getName() + " sent you a connection request");
        notification.setType("CONNECTION_REQUEST");
        notification.setRead(false);
        notification.setUser(receiver);

        notifications.save(notification);

        return savedConnection;
    }

    public List<Connection> getPendingRequests(
            Long receiverId, String email) {

        if (!currentUser(email).getId().equals(receiverId))
            throw new AccessDeniedException(
                    "You can view only your own requests");

        return connections.findByReceiverId(receiverId)
                .stream()
                .filter(c -> "PENDING".equals(c.getStatus()))
                .toList();
    }

    public Connection acceptConnectionRequest(Long id, String email) {
        return updateRequest(id, email, "ACCEPTED", "accepted");
    }

    public Connection rejectConnectionRequest(Long id, String email) {
        return updateRequest(id, email, "REJECTED", "rejected");
    }

    private Connection updateRequest(
            Long id, String email, String status, String action) {

        User current = currentUser(email);

        Connection c = connections.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Connection request not found"));

        if (!c.getReceiver().getId().equals(current.getId()))
            throw new AccessDeniedException(
                    "Only the recipient can " + action + " this request");

        if (!"PENDING".equals(c.getStatus()))
            throw new IllegalArgumentException(
                    "Only pending requests can be " + action);

        c.setStatus(status);
        return connections.save(c);
    }

    public List<Connection> getConnections(Long userId) {
        return connections.findBySenderIdOrReceiverId(userId, userId)
                .stream()
                .filter(c -> "ACCEPTED".equals(c.getStatus()))
                .toList();
    }

    private User currentUser(String email) {
        if (email == null || email.isBlank()
                || "anonymousUser".equals(email))
            throw new AccessDeniedException("Authentication required");

        User user = users.findByEmail(email);

        if (user == null)
            throw new AccessDeniedException("User not found");

        return user;
    }
}
