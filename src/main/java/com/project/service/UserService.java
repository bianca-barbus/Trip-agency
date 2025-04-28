package com.project.service;

import com.project.model.User;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface UserService {
    User registerUser(User user);
    List<User> getAllUsers();
    User getUserById(Long userId);
    User updateUser(Long userId, User user);
    void deleteUser(Long userId);
    User authenticate(String email, String password);
}

