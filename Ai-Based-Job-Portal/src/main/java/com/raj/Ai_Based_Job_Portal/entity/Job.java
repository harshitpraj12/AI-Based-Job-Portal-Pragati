package com.raj.Ai_Based_Job_Portal.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    @Column(length = 3000)
    private String description;
    private String location;
    private String salary;
    private Integer experience;
    private String skillRequirement;
    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;
}
