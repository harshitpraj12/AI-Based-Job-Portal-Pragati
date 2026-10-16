package com.raj.Ai_Based_Job_Portal.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class EducationDto {
    private String collegeName;
    private String degree;
    private Float marks;
    private LocalDate startDate;
    private LocalDate endDate;
}
