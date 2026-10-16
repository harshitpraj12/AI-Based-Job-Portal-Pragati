package com.raj.Ai_Based_Job_Portal.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ResumeFeedbackResponse {
    @JsonProperty("overallScore")
    @JsonAlias({"overallScore", "score", "matchScore", "overall_score", "overall", "rating"})
    private Integer overallScore;

    @JsonProperty("summary")
    @JsonAlias({"summary", "overview", "feedbackSummary", "description"})
    private String summary;

    @JsonProperty("strength")
    @JsonAlias({"strength", "strengths", "keyStrengths", "key_strengths", "positives"})
    private List<String> strength;

    @JsonProperty("weakness")
    @JsonAlias({"weakness", "weaknesses", "gaps", "areasOfImprovement", "areas_of_improvement", "negatives"})
    private List<String> weakness;

    @JsonProperty("suggessions")
    @JsonAlias({"suggessions", "suggestions", "improvements", "recommendations", "actionableSuggestions"})
    private List<String> suggessions;
}
