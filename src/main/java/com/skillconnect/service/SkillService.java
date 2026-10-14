package com.skillconnect.service;

import com.skillconnect.entity.Skill;
import com.skillconnect.entity.User;
import com.skillconnect.repository.SkillRepository;
import com.skillconnect.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillService {

    private final SkillRepository skillRepository;
    private final UserRepository userRepository;

    public SkillService(SkillRepository skillRepository,
                        UserRepository userRepository) {
        this.skillRepository = skillRepository;
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

    private void verifyOwnership(Skill skill, User authenticatedUser) {
        if (skill.getUser() == null
                || !skill.getUser().getId()
                .equals(authenticatedUser.getId())) {
            throw new AccessDeniedException(
                    "You cannot modify another user's skill");
        }
    }

    public Skill saveSkill(Long userId, Skill skill, String email) {
        User authenticatedUser = getAuthenticatedUser(email);

        if (!authenticatedUser.getId().equals(userId)) {
            throw new AccessDeniedException(
                    "You can only add skills to your own account");
        }

        skill.setUser(authenticatedUser);
        return skillRepository.save(skill);
    }

    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    public Skill getSkillById(Long id) {
        return skillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill not found"));
    }

    public List<Skill> getSkillsByUserId(Long userId) {
        return skillRepository.findByUserId(userId);
    }

    public Skill updateSkill(Long id, Skill updatedSkill, String email) {
        User authenticatedUser = getAuthenticatedUser(email);
        Skill existingSkill = getSkillById(id);

        verifyOwnership(existingSkill, authenticatedUser);
        existingSkill.setName(updatedSkill.getName());

        return skillRepository.save(existingSkill);
    }

    public void deleteSkill(Long id, String email) {
        User authenticatedUser = getAuthenticatedUser(email);
        Skill existingSkill = getSkillById(id);

        verifyOwnership(existingSkill, authenticatedUser);
        skillRepository.delete(existingSkill);
    }
}
