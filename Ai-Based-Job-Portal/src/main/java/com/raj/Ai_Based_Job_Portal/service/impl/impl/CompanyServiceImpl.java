package com.raj.Ai_Based_Job_Portal.service.impl.impl;

import com.raj.Ai_Based_Job_Portal.dto.CompanyRequestDto;
import com.raj.Ai_Based_Job_Portal.dto.CompanyResponseDto;
import com.raj.Ai_Based_Job_Portal.entity.Company;
import com.raj.Ai_Based_Job_Portal.entity.User;
import com.raj.Ai_Based_Job_Portal.repository.CompanyRepository;
import com.raj.Ai_Based_Job_Portal.repository.UserRepository;
import com.raj.Ai_Based_Job_Portal.security.AuthenticatedUserService;
import com.raj.Ai_Based_Job_Portal.service.impl.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final AuthenticatedUserService userService;

    @Override
    public CompanyResponseDto createCompany(CompanyRequestDto request) {
        User recruiter = userService.getCurrentUser();
        Company company = Company.builder()
                .companyName(request.getCompanyName())
                .website(request.getWebsite())
                .location(request.getLocation())
                .description(request.getDescription())
                .recruiter(recruiter)
                .build();
        Company saveCompany = companyRepository.save(company);
        return CompanyResponseDto.builder()
                .companyName(saveCompany.getCompanyName())
                .id(saveCompany.getId())
                .description(saveCompany.getDescription())
                .location(saveCompany.getLocation())
                .website(saveCompany.getWebsite())
                .build();
    }

    @Override
    public List<CompanyResponseDto> getAllCompanies() {
        User recruiter = userService.getCurrentUser();
        List<Company> companies = companyRepository.findByRecruiterId(recruiter.getId());
        List<CompanyResponseDto> companyResponseDto = new ArrayList<>();
        for(Company company : companies){
            CompanyResponseDto dto = CompanyResponseDto.builder()
                    .id(company.getId())
                    .companyName(company.getCompanyName())
                    .website(company.getWebsite())
                    .location(company.getLocation())
                    .description(company.getDescription())
                    .build();
            companyResponseDto.add(dto);
        }
        return companyResponseDto;
    }

    @Override
    public CompanyResponseDto updateCompany(Long id, CompanyRequestDto request) {
        Company company = companyRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Company not found of id "+ id));
        company.setCompanyName(request.getCompanyName());
        company.setWebsite(request.getWebsite());
        company.setLocation(request.getLocation());
        company.setDescription(request.getDescription());
        Company update = companyRepository.save(company);
        return CompanyResponseDto.builder()
                .description(update.getDescription())
                .companyName(update.getCompanyName())
                .location(update.getLocation())
                .website(update.getWebsite())
                .id(update.getId())
                .build();
    }
}
