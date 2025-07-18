package com.project.model;

import com.project.model.UserType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "actvity_log")
@Getter
@Setter
@NoArgsConstructor
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String username;
    private UserType userType;
    private String action;
    private LocalDateTime timestamp;

    public ActivityLog(String userId, String username, UserType userType, String action) {
        this.userId = userId;
        this.username = username;
        this.userType = userType;
        this.action = action;
        this.timestamp = LocalDateTime.now();
    }

}
