package com.raj.Ai_Based_Job_Portal.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "resume_analysis")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeAnalysis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer matchScore;

    @Column(length = 5000)
    private String strength;

    @Column(length = 5000)
    private String missingSkills;

    @Column(length = 5000)
    private String suggestions;

    @OneToOne
    @JoinColumn(name = "application_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private JobApplication application;

}
