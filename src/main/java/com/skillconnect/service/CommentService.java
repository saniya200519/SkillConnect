package com.skillconnect.service;

import com.skillconnect.entity.*;
import com.skillconnect.repository.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CommentService {
    private final CommentRepository comments;
    private final PostRepository posts;
    private final UserRepository users;

    public CommentService(CommentRepository comments, PostRepository posts, UserRepository users) {
        this.comments = comments;
        this.posts = posts;
        this.users = users;
    }

    public Comment addComment(Comment comment, String email) {
        if (comment.getPost() == null || comment.getPost().getId() == null)
            throw new IllegalArgumentException("Post ID is required");
        User user = currentUser(email);
        Post post = posts.findById(comment.getPost().getId())
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));
        comment.setUser(user);
        comment.setPost(post);
        return comments.save(comment);
    }

    public List<Comment> getCommentsByPost(Long postId) {
        return comments.findByPostId(postId);
    }

    public void deleteComment(Long id, String email) {
        Comment comment = comments.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));
        if (!comment.getUser().getId().equals(currentUser(email).getId()))
            throw new AccessDeniedException("You can delete only your own comments");
        comments.delete(comment);
    }

    private User currentUser(String email) {
        if (email == null || email.isBlank() || "anonymousUser".equals(email))
            throw new AccessDeniedException("Authentication required");
        User user = users.findByEmail(email);
        if (user == null) throw new AccessDeniedException("User not found");
        return user;
    }
}
