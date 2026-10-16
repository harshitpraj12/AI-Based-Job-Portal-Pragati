package com.raj.Ai_Based_Job_Portal.repository;

import com.raj.Ai_Based_Job_Portal.dto.JobResponseDto;
import com.raj.Ai_Based_Job_Portal.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    List<Company> findByRecruiterId(Long recruiterId);
}
