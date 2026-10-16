package com.raj.Ai_Based_Job_Portal.exception;

public class InvalidCredentialsException extends RuntimeException{
    public InvalidCredentialsException(){
        super("Invalid Email OR Password");
    }
}
