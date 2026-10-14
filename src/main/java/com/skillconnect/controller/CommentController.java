package com.skillconnect.controller;

import com.skillconnect.entity.Comment;
import com.skillconnect.service.CommentService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    private final CommentService service;
    public CommentController(CommentService service) { this.service = service; }

    @PostMapping
    public Comment addComment(@RequestBody Comment comment, Authentication auth) {
        return service.addComment(comment, auth.getName());
    }

    @GetMapping("/post/{postId}")
    public List<Comment> getCommentsByPost(@PathVariable Long postId) {
        return service.getCommentsByPost(postId);
    }

    @DeleteMapping("/{id}")
    public String deleteComment(@PathVariable Long id, Authentication auth) {
        service.deleteComment(id, auth.getName());
        return "Comment deleted successfully";
    }
}
