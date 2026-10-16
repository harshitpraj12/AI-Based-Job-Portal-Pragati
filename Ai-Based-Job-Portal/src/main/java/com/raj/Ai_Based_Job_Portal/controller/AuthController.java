package com.raj.Ai_Based_Job_Portal.controller;

import com.raj.Ai_Based_Job_Portal.dto.LoginRequestDto;
import com.raj.Ai_Based_Job_Portal.dto.LoginResponseDto;
import com.raj.Ai_Based_Job_Portal.dto.RegisterRequestDto;
import com.raj.Ai_Based_Job_Portal.dto.RegisterResponseDto;
import com.raj.Ai_Based_Job_Portal.service.impl.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDto> register(@Valid @RequestBody RegisterRequestDto requestDto){
        return ResponseEntity.ok(authService.register(requestDto));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto requestDto){
        return ResponseEntity.ok(authService.login(requestDto));
    }

    @org.springframework.web.bind.annotation.GetMapping("/test")
    public ResponseEntity<String> testAuth(org.springframework.security.core.Authentication auth) {
        return ResponseEntity.ok("Authenticated as: " + auth.getName());
    }
}
