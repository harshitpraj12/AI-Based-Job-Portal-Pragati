package com.raj.Ai_Based_Job_Portal.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ProjectDto {
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private String details;
    private String url;
}
