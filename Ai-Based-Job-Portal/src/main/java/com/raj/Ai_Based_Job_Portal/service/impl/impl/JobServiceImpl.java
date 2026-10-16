package com.raj.Ai_Based_Job_Portal.service.impl.impl;

import com.raj.Ai_Based_Job_Portal.dto.JobRequestDto;
import com.raj.Ai_Based_Job_Portal.dto.JobResponseDto;
import com.raj.Ai_Based_Job_Portal.entity.Company;
import com.raj.Ai_Based_Job_Portal.entity.Job;
import com.raj.Ai_Based_Job_Portal.repository.CompanyRepository;
import com.raj.Ai_Based_Job_Portal.repository.JobApplicationRepository;
import com.raj.Ai_Based_Job_Portal.repository.JobRepository;
import com.raj.Ai_Based_Job_Portal.service.impl.JobService;
import com.raj.Ai_Based_Job_Portal.specification.JobSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;

import java.util.Map;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final JobSpecification jobSpecification;
    private final JobApplicationRepository jobApplicationRepository;
    private final VectorStore vectorStore;

    @Override
    public JobResponseDto createJob(JobRequestDto request) {
        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(()-> new RuntimeException("Company Not found"));
        Job job = Job.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .experience(request.getExperience())
                .company(company)
                .location(request.getLocation())
                .skillRequirement(request.getSkillsRequires())
                .salary(request.getSalary())
                .build();
        Job saveJob = jobRepository.save(job);
        
        // Save to VectorStore
        String content = "Title: " + saveJob.getTitle() + "\nDescription: " + saveJob.getDescription() + 
                         "\nSkills: " + saveJob.getSkillRequirement() + "\nLocation: " + saveJob.getLocation();
        Document document = new Document(saveJob.getId().toString(), content, Map.of("jobId", saveJob.getId()));
        vectorStore.add(List.of(document));

        return JobResponseDto.builder()
                .id(saveJob.getId())
                .title(saveJob.getTitle())
                .companyName(company.getCompanyName())
                .companyId(company.getId())
                .description(saveJob.getDescription())
                .location(saveJob.getLocation())
                .experience(saveJob.getExperience())
                .salary(saveJob.getSalary())
                .skillsRequires(saveJob.getSkillRequirement())
                .build();
    }

    @Override
    public java.util.List<JobResponseDto> getAllJobs() {
        return jobRepository.findAll().stream()
                .map(job -> JobResponseDto.builder()
                        .id(job.getId())
                        .title(job.getTitle())
                        .companyName(job.getCompany() != null ? job.getCompany().getCompanyName() : null)
                        .companyId(job.getCompany() != null ? job.getCompany().getId() : null)
                        .description(job.getDescription())
                        .location(job.getLocation())
                        .experience(job.getExperience())
                        .salary(job.getSalary())
                        .skillsRequires(job.getSkillRequirement())
                        .build())
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public JobResponseDto getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
        return JobResponseDto.builder()
                .id(job.getId())
                .title(job.getTitle())
                .companyName(job.getCompany() != null ? job.getCompany().getCompanyName() : null)
                .companyId(job.getCompany() != null ? job.getCompany().getId() : null)
                .description(job.getDescription())
                .location(job.getLocation())
                .experience(job.getExperience())
                .salary(job.getSalary())
                .skillsRequires(job.getSkillRequirement())
                .build();
    }

    @Override
    public JobResponseDto updateJob(Long id, JobRequestDto request) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company Not found"));

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setExperience(request.getExperience());
        job.setCompany(company);
        job.setLocation(request.getLocation());
        job.setSkillRequirement(request.getSkillsRequires());
        job.setSalary(request.getSalary());

        Job updatedJob = jobRepository.save(job);

        // Update in VectorStore
        String content = "Title: " + updatedJob.getTitle() + "\nDescription: " + updatedJob.getDescription() + 
                         "\nSkills: " + updatedJob.getSkillRequirement() + "\nLocation: " + updatedJob.getLocation();
        Document document = new Document(updatedJob.getId().toString(), content, Map.of("jobId", updatedJob.getId()));
        vectorStore.add(List.of(document));

        return JobResponseDto.builder()
                .id(updatedJob.getId())
                .title(updatedJob.getTitle())
                .companyName(company.getCompanyName())
                .companyId(company.getId())
                .description(updatedJob.getDescription())
                .location(updatedJob.getLocation())
                .experience(updatedJob.getExperience())
                .salary(updatedJob.getSalary())
                .skillsRequires(updatedJob.getSkillRequirement())
                .build();
    }

    @Override
    public Page<JobResponseDto> searchJobs(
            String keyword,
            String location,
            int page,
            int size
    ) {
        Specification<Job> specification = Specification
                .where(
                        JobSpecification
                                .hasKeyword(keyword)
                )
                .and(
                        JobSpecification
                                .hasLocation(location)
                );
        Page<Job> jobs = jobRepository.findAll(
                specification, PageRequest.of(page, size)
        );
        return  jobs.map(job ->
                    JobResponseDto.builder()
                            .id(job.getId())
                            .title(job.getTitle())
                            .skillsRequires(job.getSkillRequirement())
                            .salary(job.getSalary())
                            .experience(job.getExperience())
                            .location(job.getLocation())
                            .description(job.getDescription())
                            .companyName(job.getCompany().getCompanyName())
                            .build()
                );

    }

    @Override
    public String deleteJob(Long id) {
        Job job = jobRepository.findById(id).orElseThrow();
        jobApplicationRepository.findByJob(job);
        jobRepository.deleteById(id);
        vectorStore.delete(List.of(id.toString()));
        return "Job deleted Successfully";
    }
}
