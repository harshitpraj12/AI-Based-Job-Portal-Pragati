package com.raj.Ai_Based_Job_Portal.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ProfileUpdateRequest {
    private LocalDate dob;
    private String address;
    private String mobile;
    private String gender;
    private List<String> socialMedia;
    private List<EducationDto> educations;
    private List<ProjectDto> projects;
}
