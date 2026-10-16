package com.raj.Ai_Based_Job_Portal.service.impl.impl;

import com.raj.Ai_Based_Job_Portal.entity.Company;
import com.raj.Ai_Based_Job_Portal.entity.Job;
import com.raj.Ai_Based_Job_Portal.entity.JobApplication;
import com.raj.Ai_Based_Job_Portal.entity.User;
import com.raj.Ai_Based_Job_Portal.enums.ApplicationStatus;
import com.raj.Ai_Based_Job_Portal.repository.CompanyRepository;
import com.raj.Ai_Based_Job_Portal.repository.JobApplicationRepository;
import com.raj.Ai_Based_Job_Portal.repository.JobRepository;
import com.raj.Ai_Based_Job_Portal.repository.UserRepository;
import com.raj.Ai_Based_Job_Portal.security.AuthenticatedUserService;
import com.raj.Ai_Based_Job_Portal.service.impl.CreateMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CreateMessageImpl implements CreateMessage {

    private final JobApplicationRepository jobApplicationRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final AuthenticatedUserService authenticatedUserService;

    @Override
    public String createEmailMessage() {
        String candidateName = "Candidate";
        String jobTitle = "Software Developer";
        String companyName = "AI-Based Job Portal";
        String recruiterName = "Hiring Team";
        String companyWebsite = "www.jobportal.com";

        try {
            User candidate = userRepository.findByEmail("raj14praj@gmail.com").orElse(null);
            if (candidate != null) {
                candidateName = candidate.getName();
                List<JobApplication> applications = jobApplicationRepository.findByCandidate(candidate);
                if (applications != null && !applications.isEmpty()) {
                    JobApplication app = applications.get(0);
                    if (app.getJob() != null) {
                        Job job = app.getJob();
                        jobTitle = job.getTitle();
                        Company company = job.getCompany();
                        if (company != null) {
                            companyName = company.getCompanyName();
                            companyWebsite = company.getWebsite();
                            if (company.getRecruiter() != null) {
                                recruiterName = company.getRecruiter().getName();
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            // Keep default values if database retrieval fails
        }

        String html = """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Job Offer Email</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333333;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .congrats {
                            color: #2e7d32;
                            font-size: 18px;
                            font-weight: bold;
                        }
                        .details-box {
                            background-color: #f5f5f5;
                            border-left: 4px solid #1976d2;
                            padding: 15px;
                            margin: 20px 0;
                        }
                        .details-box ul {
                            list-style-type: none;
                            padding-left: 0;
                            margin: 0;
                        }
                        .details-box li {
                            margin-bottom: 8px;
                        }
                        .footer {
                            margin-top: 30px;
                            border-top: 1px solid #eeeeee;
                            padding-top: 15px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <p>Dear <strong>[candidateName]</strong>,</p>

                        <p class="congrats">Congratulations!</p>

                        <p>We are pleased to inform you that your profile has been shortlisted for the role of [jobTitle] at [companyName].</p>

                        <p>The hiring team was incredibly impressed by your interviews, your technical expertise, and your passion for this domain. We are confident that your background will be a fantastic asset to our team.</p>

                        <div class="details-box">
                            <ul>
                                <li><strong>Position:</strong> [jobTitle]</li>
                                <li><strong>Reporting To:</strong> [recruiterName]</li>
                                <li><strong>Start Date:</strong> [startDate] 5:00 PM</li>
                                <li><strong>Employment Type:</strong> Full-time</li>
                                <li><strong>Location:</strong> Remote</li>
                            </ul>
                        </div>

                        <p>Please review the attached formal offer letter for the detailed terms of employment, including compensation, benefits, and company policies.</p>

                        <p><strong>Next Steps:</strong><br>
                        To accept this offer, please sign and return the attached copy of the offer letter in <strong>2 Days</strong>.</p>

                        <p>If you have any questions regarding the offer, salary, or benefits, please feel free to reach out to me directly at +91 9876543210 or reply to this email.</p>

                        <p>Welcome to the team, [candidateName]! We look forward to achieving great things together.</p>

                        <div class="footer">
                            <p>Best regards,</p>
                            <p><strong>[recruiterName]</strong><br>
                            [Your Title]<br>
                            <strong>[companyName]</strong><br>
                            <a href="[companyWebsite]">[companyWebsite]</a></p>
                        </div>
                    </div>
                </body>
                </html>
                """;

        String startDate = LocalDate.now().plusDays(5).toString();

        return html.replace("[candidateName]", candidateName)
                .replace("[jobTitle]", jobTitle)
                .replace("[companyName]", companyName)
                .replace("[recruiterName]", recruiterName)
                .replace("[companyWebsite]", companyWebsite)
                .replace("[startDate]", startDate);
    }

    @Override
    public String createStatusUpdateMessage(JobApplication application) {
        if (application == null) {
            return null;
        }

        String candidateName = application.getCandidate() != null ? application.getCandidate().getName() : "Candidate";
        Job job = application.getJob();
        String jobTitle = job != null ? job.getTitle() : "Position";
        Company company = job != null ? job.getCompany() : null;
        String companyName = company != null ? company.getCompanyName() : "AI-Based Job Portal";
        String recruiterName = (company != null && company.getRecruiter() != null) ? company.getRecruiter().getName() : "Hiring Team";
        String companyWebsite = company != null ? company.getWebsite() : "www.jobportal.com";
        ApplicationStatus status = application.getStatus();

        if (status == ApplicationStatus.SHORTLISTED) {
            return """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <title>Application Shortlisted</title>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .status-title { color: #1976d2; font-size: 20px; font-weight: bold; }
                            .details-box { background-color: #f5f5f5; border-left: 4px solid #1976d2; padding: 15px; margin: 20px 0; }
                            .details-box ul { list-style-type: none; padding-left: 0; margin: 0; }
                            .details-box li { margin-bottom: 8px; }
                            .footer { margin-top: 30px; border-top: 1px solid #eeeeee; padding-top: 15px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <p>Dear <strong>[candidateName]</strong>,</p>

                            <p class="status-title">Great News!</p>

                            <p>We are pleased to inform you that your application for the <strong>[jobTitle]</strong> position at <strong>[companyName]</strong> has been shortlisted!</p>

                            <p>Our hiring team was impressed by your profile, and we would like to move you forward to the next stage of our selection process.</p>

                            <div class="details-box">
                                <ul>
                                    <li><strong>Applied For:</strong> [jobTitle]</li>
                                    <li><strong>Company:</strong> [companyName]</li>
                                    <li><strong>Status:</strong> Shortlisted</li>
                                </ul>
                            </div>

                            <p>One of our recruiters will reach out to you shortly to schedule an interview and discuss the next steps. Please keep an eye on your email and phone.</p>

                            <p>Thank you again for your interest in joining [companyName]. We look forward to speaking with you soon!</p>

                            <div class="footer">
                                <p>Best regards,</p>
                                <p><strong>[recruiterName]</strong><br>
                                Hiring Team<br>
                                <strong>[companyName]</strong><br>
                                <a href="[companyWebsite]">[companyWebsite]</a></p>
                            </div>
                        </div>
                    </body>
                    </html>
                    """
                    .replace("[candidateName]", candidateName)
                    .replace("[jobTitle]", jobTitle)
                    .replace("[companyName]", companyName)
                    .replace("[recruiterName]", recruiterName)
                    .replace("[companyWebsite]", companyWebsite);

        } else if (status == ApplicationStatus.HIRED) {
            String startDate = LocalDate.now().plusDays(5).toString();
            return """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <title>Job Offer Invitation</title>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .status-title { color: #2e7d32; font-size: 20px; font-weight: bold; }
                            .details-box { background-color: #f5f5f5; border-left: 4px solid #2e7d32; padding: 15px; margin: 20px 0; }
                            .details-box ul { list-style-type: none; padding-left: 0; margin: 0; }
                            .details-box li { margin-bottom: 8px; }
                            .footer { margin-top: 30px; border-top: 1px solid #eeeeee; padding-top: 15px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <p>Dear <strong>[candidateName]</strong>,</p>

                            <p class="status-title">Congratulations!</p>

                            <p>We are absolutely thrilled to offer you the position of <strong>[jobTitle]</strong> at <strong>[companyName]</strong>!</p>

                            <p>The hiring team was incredibly impressed by your interviews, your technical expertise, and your passion for this domain. We are confident that you will be a fantastic addition to our team.</p>

                            <div class="details-box">
                                <ul>
                                    <li><strong>Position:</strong> [jobTitle]</li>
                                    <li><strong>Reporting To:</strong> [recruiterName]</li>
                                    <li><strong>Proposed Start Date:</strong> [startDate] 5:00 PM</li>
                                    <li><strong>Employment Type:</strong> Full-time</li>
                                    <li><strong>Location:</strong> Remote</li>
                                </ul>
                            </div>

                            <p>Please review the attached formal offer letter for the detailed terms of employment, including compensation, benefits, and company policies.</p>

                            <p><strong>Next Steps:</strong><br>
                            To accept this offer, please sign and return the attached copy of the offer letter within <strong>2 Days</strong>.</p>

                            <p>Welcome to the team, [candidateName]! We look forward to achieving great things together.</p>

                            <div class="footer">
                                <p>Best regards,</p>
                                <p><strong>[recruiterName]</strong><br>
                                Hiring Team<br>
                                <strong>[companyName]</strong><br>
                                <a href="[companyWebsite]">[companyWebsite]</a></p>
                            </div>
                        </div>
                    </body>
                    </html>
                    """
                    .replace("[candidateName]", candidateName)
                    .replace("[jobTitle]", jobTitle)
                    .replace("[companyName]", companyName)
                    .replace("[recruiterName]", recruiterName)
                    .replace("[companyWebsite]", companyWebsite)
                    .replace("[startDate]", startDate);

        } else if (status == ApplicationStatus.REJECTED) {
            return """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <title>Application Status Update</title>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .status-title { color: #d32f2f; font-size: 20px; font-weight: bold; }
                            .footer { margin-top: 30px; border-top: 1px solid #eeeeee; padding-top: 15px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <p>Dear <strong>[candidateName]</strong>,</p>

                            <p class="status-title">Thank you for your application</p>

                            <p>Thank you for your interest in the <strong>[jobTitle]</strong> position at <strong>[companyName]</strong> and for taking the time to participate in our selection process.</p>

                            <p>We appreciate the opportunity to review your credentials and discuss your background. While our hiring team was impressed by your skills, we have decided to move forward with other candidates whose experience more closely aligns with the current requirements of this specific role.</p>

                            <p>We will keep your resume on file for future opportunities that match your qualifications. We sincerely thank you for your time and effort, and we wish you the very best in your professional endeavors.</p>

                            <div class="footer">
                                <p>Best regards,</p>
                                <p><strong>[recruiterName]</strong><br>
                                Hiring Team<br>
                                <strong>[companyName]</strong><br>
                                <a href="[companyWebsite]">[companyWebsite]</a></p>
                            </div>
                        </div>
                    </body>
                    </html>
                    """
                    .replace("[candidateName]", candidateName)
                    .replace("[jobTitle]", jobTitle)
                    .replace("[companyName]", companyName)
                    .replace("[recruiterName]", recruiterName)
                    .replace("[companyWebsite]", companyWebsite);
        }

        return null;
    }
}
