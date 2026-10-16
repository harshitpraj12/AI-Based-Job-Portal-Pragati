package com.raj.Ai_Based_Job_Portal.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "user_education")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEducation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String collegeName;
    private String degree;
    private Float marks;
    private LocalDate startDate;
    private LocalDate endDate;
}
