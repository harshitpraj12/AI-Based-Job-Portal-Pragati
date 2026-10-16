package com.raj.Ai_Based_Job_Portal.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "user_project")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private String details;
    private String url;
}
