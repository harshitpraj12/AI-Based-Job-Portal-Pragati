package com.raj.Ai_Based_Job_Portal.dto;

import com.raj.Ai_Based_Job_Portal.enums.ApplicationStatus;
import lombok.Data;

@Data
public class UpdateStatusDto {
    private ApplicationStatus status;
}
