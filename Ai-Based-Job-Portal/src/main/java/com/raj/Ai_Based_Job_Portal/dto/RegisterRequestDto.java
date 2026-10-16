package com.raj.Ai_Based_Job_Portal.dto;

import com.raj.Ai_Based_Job_Portal.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequestDto {
    @NotBlank
    private String name;
    @Email
    private String email;
    @NotBlank
    private String password;
    private Role role;
}
