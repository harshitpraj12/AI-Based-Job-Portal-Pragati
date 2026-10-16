package com.raj.Ai_Based_Job_Portal.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "resumes")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    private String filePath;

    private  String fileType;

    private Long fileSize;

    @Column(columnDefinition = "LONGTEXT")
    private String parsedContent;

    @OneToOne
    @JoinColumn(name = "candidate_id")
    private User candidate;
}
