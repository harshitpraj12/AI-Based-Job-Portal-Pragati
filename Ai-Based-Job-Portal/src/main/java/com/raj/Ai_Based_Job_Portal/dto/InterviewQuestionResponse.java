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
public class InterviewQuestionResponse {
    @JsonProperty("technicalQuestions")
    @JsonAlias({"technicalQuestions", "technical_questions", "technical", "TechnicalQuestions", "Technical", "questions"})
    private List<String> technicalQuestions;

    @JsonProperty("hrQuestions")
    @JsonAlias({"hrQuestions", "hr_questions", "hr", "HrQuestions", "HR", "behavioralQuestions", "behavioral"})
    private List<String> hrQuestions;

    @JsonProperty("codingQuestions")
    @JsonAlias({"codingQuestions", "coding_questions", "coding", "CodingQuestions", "Coding", "practicalQuestions", "systemDesign"})
    private List<String> codingQuestions;
}
