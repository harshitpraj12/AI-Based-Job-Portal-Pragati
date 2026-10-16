package com.raj.Ai_Based_Job_Portal.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegisterResponseDto {
    private Long id;
    private String name;
    private String email;
    private String message;
}
