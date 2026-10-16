package com.raj.Ai_Based_Job_Portal.service.impl;

import com.raj.Ai_Based_Job_Portal.dto.InterviewQuestionResponse;
import com.raj.Ai_Based_Job_Portal.dto.JobRecommendationDto;
import com.raj.Ai_Based_Job_Portal.dto.ResumeFeedbackResponse;
import com.raj.Ai_Based_Job_Portal.entity.Job;

import java.util.List;

public interface ResumeFeedbackService {
    ResumeFeedbackResponse analyseResume(String resumeText);
    ResumeFeedbackResponse analyseResumeAndJob(String resumeText, String description);
    InterviewQuestionResponse generateInterviewQuestions(String jobTitle, String jobDescription);
    List<JobRecommendationDto> recommendJobs(String resumeText);
}
