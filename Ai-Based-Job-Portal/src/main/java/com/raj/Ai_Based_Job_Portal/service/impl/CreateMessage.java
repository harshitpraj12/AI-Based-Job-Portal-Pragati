package com.raj.Ai_Based_Job_Portal.service.impl;

import com.raj.Ai_Based_Job_Portal.entity.JobApplication;

public interface CreateMessage {
    String createEmailMessage();
    String createStatusUpdateMessage(JobApplication application);
}
