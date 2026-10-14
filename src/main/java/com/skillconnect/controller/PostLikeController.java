package com.skillconnect.controller;

import com.skillconnect.service.PostLikeService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
public class PostLikeController {
    private final PostLikeService service;
    public PostLikeController(PostLikeService service) { this.service = service; }

    @PostMapping("/{postId}/like/{userId}")
    public String likePost(@PathVariable Long postId, @PathVariable Long userId,
                           Authentication auth) {
        return service.likePost(postId, userId, auth.getName());
    }

    @GetMapping("/{postId}/likes")
    public long getLikeCount(@PathVariable Long postId) {
        return service.getLikeCount(postId);
    }
}
