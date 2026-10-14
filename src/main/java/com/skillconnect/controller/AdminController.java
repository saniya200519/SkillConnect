
package com.skillconnect.controller;

import com.skillconnect.entity.Admin;
import com.skillconnect.entity.User;
import com.skillconnect.entity.Post;
import com.skillconnect.service.AdminService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/register")
    public Admin registerAdmin(@RequestBody Admin admin) {
        return adminService.createAdmin(admin);
    }

    @PostMapping("/login")
    public String loginAdmin(@RequestBody Admin admin) {
        return adminService.login(
                admin.getEmail(),
                admin.getPassword()
        );
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return adminService.getAllUsers();
    }

    @GetMapping("/posts")
    public List<Post> getAllPosts() {
        return adminService.getAllPosts();
    }

    @DeleteMapping("/posts/{id}")
    public String deletePost(@PathVariable Long id) {
        adminService.deletePost(id);
        return "Post deleted successfully";
    }


    @DeleteMapping("/users/{id}")
    public org.springframework.http.ResponseEntity<String> deleteUser(
            @PathVariable Long id) {
        try {
            adminService.deleteUser(id);
            return org.springframework.http.ResponseEntity.ok(
                    "User deleted successfully"
            );
        } catch (RuntimeException e) {
            if ("User not found".equals(e.getMessage())) {
                return org.springframework.http.ResponseEntity.status(404)
                        .body(e.getMessage());
            }

            return org.springframework.http.ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

}
