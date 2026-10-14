package com.skillconnect.service;

import com.skillconnect.entity.Notification;
import com.skillconnect.entity.User;
import com.skillconnect.repository.NotificationRepository;
import com.skillconnect.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepository notifications;
    private final UserRepository users;

    public NotificationService(NotificationRepository notifications, UserRepository users) {
        this.notifications = notifications;
        this.users = users;
    }

    public Notification createNotification(Notification notification, String email) {
        User current = currentUser(email);
        if (notification.getUser() != null && notification.getUser().getId() != null
                && !notification.getUser().getId().equals(current.getId()))
            throw new AccessDeniedException("You cannot create notifications for another user");
        notification.setUser(current);
        notification.setRead(false);
        return notifications.save(notification);
    }

    public List<Notification> getNotificationsByUser(Long userId, String email) {
        if (!currentUser(email).getId().equals(userId))
            throw new AccessDeniedException("You can view only your own notifications");
        return notifications.findByUserId(userId);
    }

    public Notification markAsRead(Long id, String email) {
        Notification n = ownedNotification(id, email);
        n.setRead(true);
        return notifications.save(n);
    }

    public void deleteNotification(Long id, String email) {
        notifications.delete(ownedNotification(id, email));
    }

    private Notification ownedNotification(Long id, String email) {
        Notification n = notifications.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
        if (!n.getUser().getId().equals(currentUser(email).getId()))
            throw new AccessDeniedException("You can manage only your own notifications");
        return n;
    }

    private User currentUser(String email) {
        if (email == null || email.isBlank() || "anonymousUser".equals(email))
            throw new AccessDeniedException("Authentication required");
        User user = users.findByEmail(email);
        if (user == null) throw new AccessDeniedException("User not found");
        return user;
    }
}
