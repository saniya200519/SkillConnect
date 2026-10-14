
package com.skillconnect.service;

import com.skillconnect.entity.Admin;
import com.skillconnect.entity.User;
import com.skillconnect.entity.Post;
import com.skillconnect.repository.AdminRepository;
import com.skillconnect.repository.UserRepository;
import com.skillconnect.repository.PostRepository;
import com.skillconnect.repository.PostLikeRepository;
import com.skillconnect.repository.CommentRepository;
import com.skillconnect.security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PostRepository postRepository;
    private final PostLikeRepository postLikeRepository;
    private final CommentRepository commentRepository;
    private final JwtService jwtService;

    public AdminService(
            AdminRepository adminRepository,
            UserRepository userRepository,
            PostRepository postRepository,
            PostLikeRepository postLikeRepository,
            CommentRepository commentRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.postLikeRepository = postLikeRepository;
        this.commentRepository = commentRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public Admin createAdmin(Admin admin) {
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        return adminRepository.save(admin);
    }

    public String login(String email, String password) {

        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return jwtService.generateToken(admin.getEmail(), "ADMIN");
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public void deletePost(Long postId) {
        postLikeRepository.deleteByPostId(postId);
        commentRepository.deleteByPostId(postId);
        postRepository.deleteById(postId);
    }

    public void deleteUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isAdminAccount = adminRepository
                .findByEmail(user.getEmail())
                .isPresent();

        if (isAdminAccount) {
            throw new RuntimeException(
                    "Cannot delete a user account associated with an admin account."
            );
        }

        userRepository.delete(user);
    }
}