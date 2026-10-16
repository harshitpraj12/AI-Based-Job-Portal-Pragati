package com.raj.Ai_Based_Job_Portal.service.impl;

import com.raj.Ai_Based_Job_Portal.dto.ResumeAnalysisResponse;

public interface AiResumeService {
    ResumeAnalysisResponse analyze(String resumeTest, String jobDescription);
}
