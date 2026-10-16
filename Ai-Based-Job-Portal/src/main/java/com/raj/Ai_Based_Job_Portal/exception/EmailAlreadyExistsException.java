package com.raj.Ai_Based_Job_Portal.exception;

import jakarta.validation.constraints.Email;

public class EmailAlreadyExistsException extends RuntimeException{
    public EmailAlreadyExistsException(String email){
        super("Email already exists "+ email);
    }
}
