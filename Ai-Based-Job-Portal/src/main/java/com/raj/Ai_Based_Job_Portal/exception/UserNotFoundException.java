package com.raj.Ai_Based_Job_Portal.exception;

public class UserNotFoundException extends RuntimeException{
    public UserNotFoundException(String email){
        super("User Not Found of email "+ email);
    }
}
