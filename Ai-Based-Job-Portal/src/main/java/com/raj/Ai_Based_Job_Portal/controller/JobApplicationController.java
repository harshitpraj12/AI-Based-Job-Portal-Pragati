package com.raj.Ai_Based_Job_Portal.controller;

import com.raj.Ai_Based_Job_Portal.dto.ApplicantResponseDto;
import com.raj.Ai_Based_Job_Portal.dto.ApplyJobRequestDto;
import com.raj.Ai_Based_Job_Portal.dto.UpdateStatusDto;
import com.raj.Ai_Based_Job_Portal.entity.JobApplication;
import com.raj.Ai_Based_Job_Portal.entity.User;
import com.raj.Ai_Based_Job_Portal.security.AuthenticatedUserService;
import com.raj.Ai_Based_Job_Portal.service.impl.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class JobApplicationController {
    private final ApplicationService applicationService;
    private final AuthenticatedUserService authenticatedUserService;

    @PostMapping("/apply")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<String> applyJob(@RequestBody ApplyJobRequestDto request) throws IOException {
        applicationService.applyJob(request);
        return ResponseEntity.ok("Job applied Successfully");
    }
    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<List<JobApplication>> allJobs(){
        User candidate = authenticatedUserService.getCurrentUser();
        return ResponseEntity.ok(applicationService.allAppliedJobs(candidate));
    }
    @GetMapping("/job/all-job")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<List<JobApplication>> allAppliedJobs(){
        return ResponseEntity.ok(applicationService.getAllJobs());
    }
    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<JobApplication> getAppliedJob(@PathVariable("jobId") Long id){
        return ResponseEntity.ok(applicationService.getJobById(id));
    }

    @GetMapping("/jobs/{jobId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<List<ApplicantResponseDto>> getApplicationByJob(@PathVariable("jobId") Long jobId){
        return ResponseEntity.ok(applicationService.getApplicantsByJob(jobId));
    }


    @PutMapping("/job/{id}/status")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<JobApplication> updateJobStatus(@PathVariable("id") Long id, @RequestBody UpdateStatusDto dto){
        return ResponseEntity.ok(applicationService.updateStatus(id, dto));
    }
}
