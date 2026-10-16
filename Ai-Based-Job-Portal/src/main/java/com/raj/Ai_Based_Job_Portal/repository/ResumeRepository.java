package com.raj.Ai_Based_Job_Portal.repository;

import com.raj.Ai_Based_Job_Portal.entity.Resume;
import com.raj.Ai_Based_Job_Portal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ResumeRepository extends JpaRepository<Resume, Long> {
    Optional<Resume> findByCandidate(User candidate);
}
