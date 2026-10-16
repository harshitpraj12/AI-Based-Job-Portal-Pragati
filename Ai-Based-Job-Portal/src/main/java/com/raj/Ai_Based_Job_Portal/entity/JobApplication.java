package com.raj.Ai_Based_Job_Portal.entity;

import com.raj.Ai_Based_Job_Portal.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JobApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;

    @ManyToOne
    @JoinColumn(name = "candidate_id")
    private User candidate;

    private LocalDateTime appliedAt;

    @OneToOne(mappedBy = "application", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private ResumeAnalysis resumeAnalysis;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;
}
