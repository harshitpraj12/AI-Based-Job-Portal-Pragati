package com.raj.Ai_Based_Job_Portal.service.impl;

import java.io.File;

public interface EmailService {
//    Send to single person
    String sendEmail(String to, String subject, String message);

//    Send to multiple person
    String sendEmail(String [] to, String subject, String message);

//    Send with attachment
    String sendEmailWithFile(String to, String subject, String message, File file);

//    Send in HTML formate
    String sendEmailInHtml(String to, String subject, String message);
}
