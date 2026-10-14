package com.skillconnect.controller;

import com.skillconnect.entity.Project;
import com.skillconnect.service.ProjectService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping("/user/{userId}")
    public Project createProject(
            @PathVariable Long userId,
            @RequestBody Project project,
            Authentication authentication) {

        String email = authentication != null
                ? authentication.getName()
                : null;

        return projectService.saveProject(userId, project, email);
    }

    @GetMapping
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    @GetMapping("/{id}")
    public Project getProjectById(@PathVariable Long id) {
        return projectService.getProjectById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Project> getProjectsByUserId(@PathVariable Long userId) {
        return projectService.getProjectsByUserId(userId);
    }

    @PutMapping("/{id}")
    public Project updateProject(
            @PathVariable Long id,
            @RequestBody Project project,
            Authentication authentication) {

        String email = authentication != null
                ? authentication.getName()
                : null;

        return projectService.updateProject(id, project, email);
    }

    @DeleteMapping("/{id}")
    public String deleteProject(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication != null
                ? authentication.getName()
                : null;

        projectService.deleteProject(id, email);
        return "Project deleted successfully";
    }
}
