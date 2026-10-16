package com.raj.Ai_Based_Job_Portal.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class UserProfileResponseDto {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String mobile;
    private String address;
    private String gender;
    private LocalDate dob;
    private List<String> socialMedia;
    private List<EducationDto> educations;
    private List<ProjectDto> projects;
}
