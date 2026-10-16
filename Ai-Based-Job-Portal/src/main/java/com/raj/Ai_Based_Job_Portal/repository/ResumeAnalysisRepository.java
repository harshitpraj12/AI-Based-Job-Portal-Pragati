package com.raj.Ai_Based_Job_Portal.repository;

import com.raj.Ai_Based_Job_Portal.entity.JobApplication;
import com.raj.Ai_Based_Job_Portal.entity.ResumeAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResumeAnalysisRepository extends JpaRepository<ResumeAnalysis, Long> {
    Optional<ResumeAnalysis> findByApplication(JobApplication application);
}
