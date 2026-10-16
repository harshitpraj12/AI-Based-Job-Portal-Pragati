package com.raj.Ai_Based_Job_Portal.dto;

import lombok.Data;

@Data
public class JobRequestDto {
    private String title;
    private String description;
    private String location;
    private String salary;
    private Integer experience;
    private String skillsRequires;
    private Long companyId;
}
