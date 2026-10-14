package com.skillconnect.service;

import com.skillconnect.entity.*;
import com.skillconnect.repository.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
public class PostLikeService {
    private final PostLikeRepository likes;
    private final PostRepository posts;
    private final UserRepository users;

    public PostLikeService(PostLikeRepository likes, PostRepository posts, UserRepository users) {
        this.likes = likes;
        this.posts = posts;
        this.users = users;
    }

    public String likePost(Long postId, Long userId, String email) {
        User user = currentUser(email);
        if (!user.getId().equals(userId))
            throw new AccessDeniedException("You can like posts only as yourself");
        Post post = posts.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));
        if (likes.existsByPostIdAndUserId(postId, user.getId()))
            return "User already liked this post";
        PostLike like = new PostLike();
        like.setPost(post);
        like.setUser(user);
        likes.save(like);
        return "Post liked successfully";
    }

    public long getLikeCount(Long postId) {
        return likes.countByPostId(postId);
    }

    private User currentUser(String email) {
        if (email == null || email.isBlank() || "anonymousUser".equals(email))
            throw new AccessDeniedException("Authentication required");
        User user = users.findByEmail(email);
        if (user == null) throw new AccessDeniedException("User not found");
        return user;
    }
}
