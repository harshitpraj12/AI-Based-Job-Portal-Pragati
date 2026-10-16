package com.raj.Ai_Based_Job_Portal.controller;

import com.raj.Ai_Based_Job_Portal.dto.ApplyJobRequestDto;
import com.raj.Ai_Based_Job_Portal.dto.JobRequestDto;
import com.raj.Ai_Based_Job_Portal.dto.JobResponseDto;
import com.raj.Ai_Based_Job_Portal.service.impl.ApplicationService;
import com.raj.Ai_Based_Job_Portal.service.impl.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {
    private final JobService jobService;

    @PostMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<JobResponseDto> createJob(@RequestBody JobRequestDto request){
        return ResponseEntity.ok(jobService.createJob(request));
    }

    @GetMapping
    public ResponseEntity<List<JobResponseDto>> getAllJobs(){
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponseDto> getJobById(@PathVariable("id") Long id){
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<String> deleteJobById(@PathVariable Long id){
        return ResponseEntity.ok(jobService.deleteJob(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<JobResponseDto> updateJob(@PathVariable("id") Long id, @RequestBody JobRequestDto request){
        return ResponseEntity.ok(jobService.updateJob(id, request));
    }

    @GetMapping("search")
    public Page<JobResponseDto> searchJob(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        return jobService.searchJobs(keyword, location, page, size);
    }
}
