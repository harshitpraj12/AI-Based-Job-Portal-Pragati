package com.raj.Ai_Based_Job_Portal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResumeResponseDto {
    private Long id;
    private String fileName;
    private String fileType;
    private Long fileSize;
}
