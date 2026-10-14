package com.skillconnect.service;

import com.skillconnect.entity.Post;
import com.skillconnect.entity.User;
import com.skillconnect.repository.PostRepository;
import com.skillconnect.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostService(PostRepository postRepository,
                       UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser(String email) {
        if (email == null || email.isBlank()
                || "anonymousUser".equals(email)) {
            throw new AccessDeniedException("Login required");
        }
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new AccessDeniedException("User not found");
        }

        return user;


    }

    private void verifyOwnership(Post post, User authenticatedUser) {
        if (post.getUser() == null
                || !post.getUser().getId()
                .equals(authenticatedUser.getId())) {
            throw new AccessDeniedException(
                    "You cannot modify another user's post");
        }
    }

    public Post savePost(Long userId, Post post, String email) {
        User authenticatedUser = getAuthenticatedUser(email);

        if (!authenticatedUser.getId().equals(userId)) {
            throw new AccessDeniedException(
                    "You can only create posts for your own account");
        }

        post.setUser(authenticatedUser);
        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    public List<Post> getPostsByUserId(Long userId) {
        return postRepository.findByUserId(userId);
    }

    public Post updatePost(Long id, Post updatedPost, String email) {
        User authenticatedUser = getAuthenticatedUser(email);
        Post existingPost = getPostById(id);

        verifyOwnership(existingPost, authenticatedUser);
        existingPost.setContent(updatedPost.getContent());

        return postRepository.save(existingPost);
    }

    public void deletePost(Long id, String email) {
        User authenticatedUser = getAuthenticatedUser(email);
        Post existingPost = getPostById(id);

        verifyOwnership(existingPost, authenticatedUser);
        postRepository.delete(existingPost);
    }
}
