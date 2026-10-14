package com.skillconnect.controller;

import com.skillconnect.entity.Connection;
import com.skillconnect.service.ConnectionService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/connections")
public class ConnectionController {
    private final ConnectionService service;
    public ConnectionController(ConnectionService service) { this.service = service; }

    @PostMapping("/send/{senderId}/{receiverId}")
    public Connection send(@PathVariable Long senderId, @PathVariable Long receiverId,
                           Authentication auth) {
        return service.sendConnectionRequest(senderId, receiverId, auth.getName());
    }

    @GetMapping("/requests/{receiverId}")
    public List<Connection> requests(@PathVariable Long receiverId, Authentication auth) {
        return service.getPendingRequests(receiverId, auth.getName());
    }

    @PutMapping("/accept/{connectionId}")
    public Connection accept(@PathVariable Long connectionId, Authentication auth) {
        return service.acceptConnectionRequest(connectionId, auth.getName());
    }

    @PutMapping("/reject/{connectionId}")
    public Connection reject(@PathVariable Long connectionId, Authentication auth) {
        return service.rejectConnectionRequest(connectionId, auth.getName());
    }

    @GetMapping("/user/{userId}")
    public List<Connection> connections(@PathVariable Long userId) {
        return service.getConnections(userId);
    }
}
