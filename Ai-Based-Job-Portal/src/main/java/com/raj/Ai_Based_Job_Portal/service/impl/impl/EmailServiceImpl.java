package com.raj.Ai_Based_Job_Portal.service.impl.impl;

import com.raj.Ai_Based_Job_Portal.service.impl.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.Arrays;

@Service
public class EmailServiceImpl implements EmailService {

    private final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);
    private final JavaMailSender mailSender;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public String sendEmail(String to, String subject, String message) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(to);
        mailMessage.setSubject(subject);
        mailMessage.setText(message);
        mailMessage.setFrom("bookpdf247@gmail.com");
        mailSender.send(mailMessage);
        logger.info("Email has been sent...");
        return "Email has been send Successfully from bookpdf247@gmail.com to "+ to;
    }

    @Override
    public String sendEmail(String[] to, String subject, String message) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(to);
        mailMessage.setSubject(subject);
        mailMessage.setText(message);
        mailMessage.setFrom("bookpdf247@gmail.com");
        mailSender.send(mailMessage);
        logger.info("Multiple Email has been sent...");
        return "Email has been send Successfully from bookpdf247@gmail.com to "+ Arrays.toString(to);
    }

    @Override
    public String sendEmailWithFile(String to, String subject, String message, File file) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            helper.setFrom("bookpdf247@gmail.com");
            helper.setTo(to);
            helper.setText(message);
            helper.setSubject(subject);
            FileSystemResource fileSystemResource = new FileSystemResource(file);
            helper.addAttachment(fileSystemResource.getFilename(), file);

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
        return "Email has been send Successfully from bookpdf247@gmail.com to "+to+" with attachment";
    }

    @Override
    public String sendEmailInHtml(String to, String subject, String message) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(to);
            helper.setText(message, true);
            helper.setSubject(subject);
            helper.setFrom("bookpdf247@gmail.com");
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
        return "Email has been send Successfully from bookpdf247@gmail.com to "+ to;
    }
}
