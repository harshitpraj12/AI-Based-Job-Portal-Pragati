package com.raj.Ai_Based_Job_Portal.service.impl.impl;

import com.raj.Ai_Based_Job_Portal.dto.LoginRequestDto;
import com.raj.Ai_Based_Job_Portal.dto.LoginResponseDto;
import com.raj.Ai_Based_Job_Portal.dto.RegisterRequestDto;
import com.raj.Ai_Based_Job_Portal.dto.RegisterResponseDto;
import com.raj.Ai_Based_Job_Portal.entity.User;
import com.raj.Ai_Based_Job_Portal.exception.EmailAlreadyExistsException;
import com.raj.Ai_Based_Job_Portal.exception.InvalidCredentialsException;
import com.raj.Ai_Based_Job_Portal.repository.UserRepository;
import com.raj.Ai_Based_Job_Portal.security.JwtService;
import com.raj.Ai_Based_Job_Portal.service.impl.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public RegisterResponseDto register(RegisterRequestDto requestDto) {
        if(userRepository.findByEmail(requestDto.getEmail()).isPresent()){
            throw new EmailAlreadyExistsException(requestDto.getEmail());
        }
        User user = User.builder()
                .name(requestDto.getName())
                .email(requestDto.getEmail())
                .password(passwordEncoder.encode(requestDto.getPassword()))
                .role(requestDto.getRole())
                .build();
        User saveUser = userRepository.save(user);
        return RegisterResponseDto.builder()
                .name(saveUser.getName())
                .email(saveUser.getEmail())
                .id(saveUser.getId())
                .message("User registered successfully")
                .build();
    }

    @Override
    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        User user = userRepository.findByEmail(loginRequestDto.getEmail()).orElseThrow(()-> new InvalidCredentialsException());
        boolean passwordMatcher = passwordEncoder.matches(
                loginRequestDto.getPassword(),
                user.getPassword()
        );
        if(!passwordMatcher){
            throw new InvalidCredentialsException();
        }
        String token = jwtService.generateToken(user);
        return LoginResponseDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .token(token)
                .role(user.getRole())
                .message("Login Successful")
                .build();
    }
}
