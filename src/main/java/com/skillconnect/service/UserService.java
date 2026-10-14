
package com.skillconnect.service;

import com.skillconnect.dto.UserProfileResponse;
import com.skillconnect.entity.User;
import com.skillconnect.repository.ProjectRepository;
import com.skillconnect.repository.SkillRepository;
import com.skillconnect.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SkillRepository skillRepository;
    private final ProjectRepository projectRepository;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            SkillRepository skillRepository,
            ProjectRepository projectRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.skillRepository = skillRepository;
        this.projectRepository = projectRepository;
    }

    public User updateUser(Long id, User updatedUser) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        existingUser.setName(updatedUser.getName());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setBio(updatedUser.getBio());
        existingUser.setPhone(updatedUser.getPhone());
        existingUser.setLocation(updatedUser.getLocation());
        existingUser.setSkills(updatedUser.getSkills());
        existingUser.setEducation(updatedUser.getEducation());

        return userRepository.save(existingUser);
    }

    public User saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserByEmail(String email) {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        return user;
    }


    public User login(String email, String password) {
        User user = userRepository.findByEmail(email);

        if (user == null || user.getPassword() == null
                || password == null) {
            return null;
        }

        String storedPassword = user.getPassword();

        // Normal login for BCrypt-encoded passwords
        if (passwordEncoder.matches(password, storedPassword)) {
            return user;
        }

        // Migrate an old plain-text password to BCrypt
        // only after the supplied password matches exactly.
        if (password.equals(storedPassword)) {
            user.setPassword(passwordEncoder.encode(password));
            userRepository.save(user);
            return user;
        }

        return null;
    }

    public UserProfileResponse getUserProfile(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfileResponse response = new UserProfileResponse();

        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setBio(user.getBio());
        response.setPhone(user.getPhone());
        response.setLocation(user.getLocation());
        response.setEducation(user.getEducation());

        response.setSkills(skillRepository.findByUserId(id));
        response.setProjects(projectRepository.findByUserId(id));

        return response;
    }

    public List<User> searchUsers(String name) {
        return userRepository.findByNameContainingIgnoreCase(name);
    }


    public List<User> searchUsersBySkill(String skill) {
        List<com.skillconnect.entity.Skill> matchingSkills =
                skillRepository.findByNameContainingIgnoreCase(skill);

        return matchingSkills.stream()
                .map(com.skillconnect.entity.Skill::getUser)
                .filter(user -> user != null)
                .distinct()
                .toList();
    }
}
