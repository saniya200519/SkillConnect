package com.skillconnect.controller;

import com.skillconnect.entity.User;
import com.skillconnect.dto.LoginRequest;
import com.skillconnect.dto.LoginResponse;
import com.skillconnect.security.JwtService;
import com.skillconnect.service.UserService;
import org.springframework.web.bind.annotation.*;
import com.skillconnect.security.TokenBlacklist;
import com.skillconnect.dto.UserProfileResponse;
import org.springframework.security.core.Authentication;
import java.util.List;

@RestController
@RequestMapping("/api/users")

public class UserController {
    private final UserService userService;
    private final JwtService jwtService;
    private final TokenBlacklist tokenBlacklist;
    public UserController(UserService userService, JwtService jwtService, TokenBlacklist tokenBlacklist) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.tokenBlacklist = tokenBlacklist;
    }
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        User user = userService.login(
                request.getEmail(),
                request.getPassword()
        );
        LoginResponse response = new LoginResponse();
        if (user!= null) {
            String token = jwtService.generateToken(user.getEmail());
            response.setMessage(token);
        }
        else {
            response.setMessage("Invalid email or password");
        }
        return response;
    }
    @PostMapping("/logout")
    public String logout(@RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);

        tokenBlacklist.addToken(token);

        return "Logout successful";
    }
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }
    @GetMapping("/profile/{id}")
    public UserProfileResponse getUserProfile(@PathVariable Long id) {
        return userService.getUserProfile(id);
    }
    @GetMapping("/search")
    public List<User> searchUsers(@RequestParam String name) {
        return userService.searchUsers(name);
    }
    @GetMapping("/search/skill")
    public List<User> searchUsersBySkill(@RequestParam String skill) {
        return userService.searchUsersBySkill(skill);
    }
    @GetMapping("/me")
    public UserProfileResponse getCurrentUser(Authentication authentication) {
    String email = authentication.getName();
    User user = userService.getUserByEmail(email);
    return userService.getUserProfile(user.getId());
}
}
