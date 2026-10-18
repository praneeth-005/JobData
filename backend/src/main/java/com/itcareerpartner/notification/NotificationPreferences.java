package com.itcareerpartner.notification;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "notification_preferences")
public class NotificationPreferences {

    @Id
    private String id;
    private String userId;
    private boolean jobAlertsEnabled = true;
    private String jobAlertsCadence = "IMMEDIATE"; // IMMEDIATE, DAILY, WEEKLY
    private boolean inAppEnabled = true;
    private boolean emailAlertsEnabled = true;
    private String emailAddress = "arjun.sharma2026@gmail.com";
    private boolean emailVerified = true;
    private boolean whatsappAlertsEnabled = false;
    private String whatsappNumber = "+91 98765 43210";

    // Application Reminders
    private boolean interviewRemindersEnabled = true;
    private String interviewRemindersTiming = "1_DAY_AND_2_HOURS";
    private boolean assessmentWarningsEnabled = true;
    private String assessmentExpirationWarning = "24_HOURS";
    private boolean followupPromptsEnabled = true;
    private int followupOverdueDays = 10;

    // Filters & Guardrails
    private int minMatchScore = 85;
    private boolean quietHoursEnabled = true;
    private String quietHoursStart = "22:00";
    private String quietHoursEnd = "08:00";
    private String alertStatus = "ACTIVE"; // ACTIVE, PAUSED

    private Instant updatedAt;

    public NotificationPreferences() {
        this.updatedAt = Instant.now();
    }

    public NotificationPreferences(String userId) {
        this();
        this.userId = userId;
        this.id = "pref_" + userId;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public boolean isJobAlertsEnabled() { return jobAlertsEnabled; }
    public void setJobAlertsEnabled(boolean jobAlertsEnabled) { this.jobAlertsEnabled = jobAlertsEnabled; }

    public String getJobAlertsCadence() { return jobAlertsCadence; }
    public void setJobAlertsCadence(String jobAlertsCadence) { this.jobAlertsCadence = jobAlertsCadence; }

    public boolean isInAppEnabled() { return inAppEnabled; }
    public void setInAppEnabled(boolean inAppEnabled) { this.inAppEnabled = inAppEnabled; }

    public boolean isEmailAlertsEnabled() { return emailAlertsEnabled; }
    public void setEmailAlertsEnabled(boolean emailAlertsEnabled) { this.emailAlertsEnabled = emailAlertsEnabled; }

    public String getEmailAddress() { return emailAddress; }
    public void setEmailAddress(String emailAddress) { this.emailAddress = emailAddress; }

    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }

    public boolean isWhatsappAlertsEnabled() { return whatsappAlertsEnabled; }
    public void setWhatsappAlertsEnabled(boolean whatsappAlertsEnabled) { this.whatsappAlertsEnabled = whatsappAlertsEnabled; }

    public String getWhatsappNumber() { return whatsappNumber; }
    public void setWhatsappNumber(String whatsappNumber) { this.whatsappNumber = whatsappNumber; }

    public boolean isInterviewRemindersEnabled() { return interviewRemindersEnabled; }
    public void setInterviewRemindersEnabled(boolean interviewRemindersEnabled) { this.interviewRemindersEnabled = interviewRemindersEnabled; }

    public String getInterviewRemindersTiming() { return interviewRemindersTiming; }
    public void setInterviewRemindersTiming(String interviewRemindersTiming) { this.interviewRemindersTiming = interviewRemindersTiming; }

    public boolean isAssessmentWarningsEnabled() { return assessmentWarningsEnabled; }
    public void setAssessmentWarningsEnabled(boolean assessmentWarningsEnabled) { this.assessmentWarningsEnabled = assessmentWarningsEnabled; }

    public String getAssessmentExpirationWarning() { return assessmentExpirationWarning; }
    public void setAssessmentExpirationWarning(String assessmentExpirationWarning) { this.assessmentExpirationWarning = assessmentExpirationWarning; }

    public boolean isFollowupPromptsEnabled() { return followupPromptsEnabled; }
    public void setFollowupPromptsEnabled(boolean followupPromptsEnabled) { this.followupPromptsEnabled = followupPromptsEnabled; }

    public int getFollowupOverdueDays() { return followupOverdueDays; }
    public void setFollowupOverdueDays(int followupOverdueDays) { this.followupOverdueDays = followupOverdueDays; }

    public int getMinMatchScore() { return minMatchScore; }
    public void setMinMatchScore(int minMatchScore) { this.minMatchScore = minMatchScore; }

    public boolean isQuietHoursEnabled() { return quietHoursEnabled; }
    public void setQuietHoursEnabled(boolean quietHoursEnabled) { this.quietHoursEnabled = quietHoursEnabled; }

    public String getQuietHoursStart() { return quietHoursStart; }
    public void setQuietHoursStart(String quietHoursStart) { this.quietHoursStart = quietHoursStart; }

    public String getQuietHoursEnd() { return quietHoursEnd; }
    public void setQuietHoursEnd(String quietHoursEnd) { this.quietHoursEnd = quietHoursEnd; }

    public String getAlertStatus() { return alertStatus; }
    public void setAlertStatus(String alertStatus) { this.alertStatus = alertStatus; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
