package com.skillconnect.controller;

import com.skillconnect.entity.Skill;
import com.skillconnect.service.SkillService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @PostMapping("/user/{userId}")
    public Skill createSkill(
            @PathVariable Long userId,
            @RequestBody Skill skill,
            Authentication authentication) {

        String email = authentication != null
                ? authentication.getName()
                : null;

        return skillService.saveSkill(userId, skill, email);
    }

    @GetMapping
    public List<Skill> getAllSkills() {
        return skillService.getAllSkills();
    }

    @GetMapping("/{id}")
    public Skill getSkillById(@PathVariable Long id) {
        return skillService.getSkillById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Skill> getSkillsByUserId(@PathVariable Long userId) {
        return skillService.getSkillsByUserId(userId);
    }

    @PutMapping("/{id}")
    public Skill updateSkill(
            @PathVariable Long id,
            @RequestBody Skill skill,
            Authentication authentication) {

        String email = authentication != null
                ? authentication.getName()
                : null;

        return skillService.updateSkill(id, skill, email);
    }

    @DeleteMapping("/{id}")
    public String deleteSkill(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication != null
                ? authentication.getName()
                : null;

        skillService.deleteSkill(id, email);
        return "Skill deleted successfully";
    }
}
