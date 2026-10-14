package com.skillconnect.controller;

import com.skillconnect.entity.Post;
import com.skillconnect.service.PostService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping("/user/{userId}")
    public Post createPost(
            @PathVariable Long userId,
            @RequestBody Post post,
            Authentication authentication) {

        String email = authentication != null
                ? authentication.getName()
                : null;

        return postService.savePost(userId, post, email);
    }

    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    @GetMapping("/{id}")
    public Post getPostById(@PathVariable Long id) {
        return postService.getPostById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Post> getPostsByUserId(@PathVariable Long userId) {
        return postService.getPostsByUserId(userId);
    }

    @PutMapping("/{id}")
    public Post updatePost(
            @PathVariable Long id,
            @RequestBody Post post,
            Authentication authentication) {

        String email = authentication != null
                ? authentication.getName()
                : null;

        return postService.updatePost(id, post, email);
    }

    @DeleteMapping("/{id}")
    public String deletePost(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication != null
                ? authentication.getName()
                : null;

        postService.deletePost(id, email);
        return "Post deleted successfully";
    }
}
