package com.raj.Ai_Based_Job_Portal.service.impl;

import com.raj.Ai_Based_Job_Portal.dto.ApplicantResponseDto;
import com.raj.Ai_Based_Job_Portal.dto.ApplyJobRequestDto;
import com.raj.Ai_Based_Job_Portal.dto.UpdateStatusDto;
import com.raj.Ai_Based_Job_Portal.entity.JobApplication;
import com.raj.Ai_Based_Job_Portal.entity.User;

import java.io.IOException;
import java.util.List;

public interface ApplicationService {
    void applyJob(ApplyJobRequestDto request) throws IOException;
    List<JobApplication> allAppliedJobs(User candidate);
    List<JobApplication> getAllJobs();
    JobApplication getJobById(Long id);
    JobApplication updateStatus(Long id, UpdateStatusDto dto);
    List<ApplicantResponseDto> getApplicantsByJob(Long jobId);
}
