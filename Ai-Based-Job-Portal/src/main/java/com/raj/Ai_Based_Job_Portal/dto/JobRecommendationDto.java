package com.raj.Ai_Based_Job_Portal.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class JobRecommendationDto {

    @JsonProperty("jobId")
    @JsonAlias({"jobId", "job_id", "id", "jobID"})
    private Long jobId;

    @JsonProperty("jobTitle")
    @JsonAlias({"jobTitle", "job_title", "title", "name", "role"})
    private String jobTitle;

    @JsonProperty("company")
    @JsonAlias({"company", "companyName", "company_name", "employer"})
    private String company;

    @JsonProperty("matchScore")
    @JsonAlias({"matchScore", "match_score", "score", "matchPercentage", "match"})
    private Integer matchScore;

    @JsonProperty("reason")
    @JsonAlias({"reason", "why", "matchReason", "rationale", "explanation"})
    private String reason;
}
