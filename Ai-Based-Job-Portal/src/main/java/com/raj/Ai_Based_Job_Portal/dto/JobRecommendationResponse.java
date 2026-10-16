package com.raj.Ai_Based_Job_Portal.dto;

import lombok.Data;

import java.util.List;

@Data
public class JobRecommendationResponse {
    private List<JobRecommendationDto> recommendations;
}
