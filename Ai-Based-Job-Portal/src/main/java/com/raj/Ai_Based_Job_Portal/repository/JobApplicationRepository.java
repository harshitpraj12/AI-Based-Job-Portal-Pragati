package com.raj.Ai_Based_Job_Portal.repository;

import com.raj.Ai_Based_Job_Portal.entity.Job;
import com.raj.Ai_Based_Job_Portal.entity.JobApplication;
import com.raj.Ai_Based_Job_Portal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByCandidate(User candidate);
    List<JobApplication> findByJob(Job job);
    boolean existsByJobAndCandidate(Job job, User candidate);

    @org.springframework.data.jpa.repository.Query("SELECT ja FROM JobApplication ja WHERE ja.job.company.recruiter.id = :recruiterId")
    List<JobApplication> findByJobCompanyRecruiterId(@org.springframework.data.repository.query.Param("recruiterId") Long recruiterId);
}
