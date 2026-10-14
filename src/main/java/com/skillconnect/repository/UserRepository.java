package com.skillconnect.repository;

import com.skillconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    List<User> findByNameContainingIgnoreCase(String name);
    List<User> findBySkillsContainingIgnoreCase(String skill);
}