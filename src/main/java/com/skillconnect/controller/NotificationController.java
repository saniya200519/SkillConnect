package com.skillconnect.controller;

import com.skillconnect.entity.Notification;
import com.skillconnect.service.NotificationService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService service;
    public NotificationController(NotificationService service) { this.service = service; }

    @PostMapping
    public Notification create(@RequestBody Notification notification, Authentication auth) {
        return service.createNotification(notification, auth.getName());
    }

    @GetMapping("/user/{userId}")
    public List<Notification> get(@PathVariable Long userId, Authentication auth) {
        return service.getNotificationsByUser(userId, auth.getName());
    }

    @PutMapping("/{id}/read")
    public Notification markRead(@PathVariable Long id, Authentication auth) {
        return service.markAsRead(id, auth.getName());
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id, Authentication auth) {
        service.deleteNotification(id, auth.getName());
        return "Notification deleted successfully";
    }
}
