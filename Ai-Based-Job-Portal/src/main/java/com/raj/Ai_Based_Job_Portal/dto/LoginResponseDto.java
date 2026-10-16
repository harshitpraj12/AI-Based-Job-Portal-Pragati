package com.raj.Ai_Based_Job_Portal.dto;

import com.raj.Ai_Based_Job_Portal.enums.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponseDto {
    private Long id;
    private String name;
    private String email;
    private String token;
    private Role role;
    private String message;
}
