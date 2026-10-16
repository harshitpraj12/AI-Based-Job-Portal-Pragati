package com.raj.Ai_Based_Job_Portal.controller;

import com.raj.Ai_Based_Job_Portal.dto.ProfileUpdateRequest;
import com.raj.Ai_Based_Job_Portal.dto.ProfileUpdateResponse;
import com.raj.Ai_Based_Job_Portal.dto.UserProfileResponseDto;
import com.raj.Ai_Based_Job_Portal.service.impl.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponseDto> getProfile(){
        return ResponseEntity.ok(userService.getProfile());
    }

    @PatchMapping("/update")
    public ResponseEntity<ProfileUpdateResponse> updateProfile(@RequestBody ProfileUpdateRequest request){
        return ResponseEntity.ok(userService.updateProfile(request));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id){
        return ResponseEntity.ok(userService.deleteUser(id));
    }

    @GetMapping("/test")
    public ResponseEntity<String> testAuth(org.springframework.security.core.Authentication auth) {
        return ResponseEntity.ok("Authenticated as: " + auth.getName());
    }
}
