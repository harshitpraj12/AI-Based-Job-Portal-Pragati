package com.raj.Ai_Based_Job_Portal.repository;

import com.raj.Ai_Based_Job_Portal.dto.JobResponseDto;
import com.raj.Ai_Based_Job_Portal.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {
    List<Job> findByCompanyRecruiterId(Long recruiterId);
}
