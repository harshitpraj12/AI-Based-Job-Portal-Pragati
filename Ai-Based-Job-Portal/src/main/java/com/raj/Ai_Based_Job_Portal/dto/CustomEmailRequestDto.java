package com.raj.Ai_Based_Job_Portal.dto;

import lombok.Data;

@Data
public class CustomEmailRequestDto {
    private String to;
    private String subject;
    private String message;
}
