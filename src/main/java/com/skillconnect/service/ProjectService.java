package com.skillconnect.service;

import com.skillconnect.entity.Project;
import com.skillconnect.entity.User;
import com.skillconnect.repository.ProjectRepository;
import com.skillconnect.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectService(ProjectRepository projectRepository,
                          UserRepository userRepository) {
        this.projectRepository = projectRepository;
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



    private void verifyOwnership(
            Project project, User authenticatedUser) {

        if (project.getUser() == null
                || !project.getUser().getId()
                .equals(authenticatedUser.getId())) {
            throw new AccessDeniedException(
                    "You cannot modify another user's project");
        }
    }

    public Project saveProject(
            Long userId, Project project, String email) {

        User authenticatedUser = getAuthenticatedUser(email);

        if (!authenticatedUser.getId().equals(userId)) {
            throw new AccessDeniedException(
                    "You can only add projects to your own account");
        }

        project.setUser(authenticatedUser);
        return projectRepository.save(project);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Project not found"));
    }

    public List<Project> getProjectsByUserId(Long userId) {
        return projectRepository.findByUserId(userId);
    }

    public Project updateProject(
            Long id, Project updatedProject, String email) {

        User authenticatedUser = getAuthenticatedUser(email);
        Project existingProject = getProjectById(id);

        verifyOwnership(existingProject, authenticatedUser);

        existingProject.setTitle(updatedProject.getTitle());
        existingProject.setDescription(updatedProject.getDescription());
        existingProject.setTechnologies(updatedProject.getTechnologies());
        existingProject.setProjectUrl(updatedProject.getProjectUrl());

        return projectRepository.save(existingProject);
    }

    public void deleteProject(Long id, String email) {
        User authenticatedUser = getAuthenticatedUser(email);
        Project existingProject = getProjectById(id);

        verifyOwnership(existingProject, authenticatedUser);
        projectRepository.delete(existingProject);
    }
}
