package com.project.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.project.model.User;
import com.project.service.UserService;
import com.project.model.ActivityLog;
import com.project.repository.ActivityLogRepository;
import com.project.websockets.ActivityNotifier;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final ActivityLogRepository activityLogRepository;

    @Autowired
    private ActivityNotifier notifier;

    public UserController(UserService userService, ActivityLogRepository activityLogRepository) {
        this.userService = userService;
        this.activityLogRepository = activityLogRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User registeredUser = userService.registerUser(user);
        return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<User> loginUser(@RequestBody User user) {
        User authenticatedUser = userService.authenticate(user.getUsername(), user.getPassword());

        if (authenticatedUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        ActivityLog log = new ActivityLog(
                authenticatedUser.getUserId().toString(),
                authenticatedUser.getUsername(),
                authenticatedUser.getUserType(),
                "LOGIN"
        );

        activityLogRepository.save(log);
        try {
            notifier.broadcast(log);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok(authenticatedUser);
    }

    @GetMapping("/activity-logs")
    public ResponseEntity<List<ActivityLog>> getActivityLogs() {
        List<ActivityLog> logs = (List<ActivityLog>) activityLogRepository.findAll();
        return ResponseEntity.ok(logs);
    }


    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        return ResponseEntity.ok(userService.updateUser(id, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
