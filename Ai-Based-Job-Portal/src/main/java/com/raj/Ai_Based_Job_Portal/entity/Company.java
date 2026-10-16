package com.raj.Ai_Based_Job_Portal.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;

    private String website;

    private String location;

    @Column(length = 1000)
    private String description;

    @ManyToOne
    @JoinColumn(name = "recruiter_id")
    private User recruiter;
}
