package com.raj.Ai_Based_Job_Portal.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JobResponseDto {
    private Long id;
    private String title;
    private String description;
    private String location;
    private String salary;
    private Integer experience;
    private String skillsRequires;
    private String companyName;
    private Long companyId;
}
