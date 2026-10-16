package com.raj.Ai_Based_Job_Portal.controller;

import com.raj.Ai_Based_Job_Portal.dto.CompanyRequestDto;
import com.raj.Ai_Based_Job_Portal.dto.CompanyResponseDto;
import com.raj.Ai_Based_Job_Portal.service.impl.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {
    private final CompanyService companyService;

    @PostMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<CompanyResponseDto> createCompany(@RequestBody CompanyRequestDto request){
        return ResponseEntity.ok(companyService.createCompany(request));
    }

    @GetMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<List<CompanyResponseDto>> getAllCompanies(){
        return ResponseEntity.ok(companyService.getAllCompanies());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<CompanyResponseDto> updateCompany(@PathVariable Long id, @RequestBody CompanyRequestDto request){
        return ResponseEntity.ok(companyService.updateCompany(id, request));
    }
}
