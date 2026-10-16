package com.raj.Ai_Based_Job_Portal.service.impl;

import com.raj.Ai_Based_Job_Portal.dto.LoginRequestDto;
import com.raj.Ai_Based_Job_Portal.dto.LoginResponseDto;
import com.raj.Ai_Based_Job_Portal.dto.RegisterRequestDto;
import com.raj.Ai_Based_Job_Portal.dto.RegisterResponseDto;

public interface AuthService {
    RegisterResponseDto register(RegisterRequestDto requestDto);
    LoginResponseDto login(LoginRequestDto loginRequestDto);
}
