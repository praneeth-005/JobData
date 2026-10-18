package com.itcareerpartner.tracker;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "application_activities")
public class ActivityItem {

    @Id
    private String id;
    private String userId;
    private String applicationId;
    private String company;
    private String title;
    private String activityType; // "INTERVIEW", "ASSESSMENT", "FOLLOW_UP", "DEADLINE"
    private String scheduledDateFormatted; // "Today", "Tomorrow", "Oct 21, 2026"
    private String scheduledTimeFormatted; // "2:30 PM - 3:30 PM IST"
    private Instant scheduledDateTime;
    private int durationMinutes;
    private String platform; // "Google Meet", "HackerEarth", "Zoom", "Office"
    private String meetingLink;
    private String interviewer;
    private String status; // "UPCOMING", "COMPLETED", "RESCHEDULED", "OVERDUE"
    private List<String> checklist = new ArrayList<>();
    private String notes;
    private Instant createdAt;

    public ActivityItem() {
        this.createdAt = Instant.now();
        this.status = "UPCOMING";
        this.durationMinutes = 60;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getApplicationId() { return applicationId; }
    public void setApplicationId(String applicationId) { this.applicationId = applicationId; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getActivityType() { return activityType; }
    public void setActivityType(String activityType) { this.activityType = activityType; }

    public String getScheduledDateFormatted() { return scheduledDateFormatted; }
    public void setScheduledDateFormatted(String scheduledDateFormatted) { this.scheduledDateFormatted = scheduledDateFormatted; }

    public String getScheduledTimeFormatted() { return scheduledTimeFormatted; }
    public void setScheduledTimeFormatted(String scheduledTimeFormatted) { this.scheduledTimeFormatted = scheduledTimeFormatted; }

    public Instant getScheduledDateTime() { return scheduledDateTime; }
    public void setScheduledDateTime(Instant scheduledDateTime) { this.scheduledDateTime = scheduledDateTime; }

    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }

    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }

    public String getMeetingLink() { return meetingLink; }
    public void setMeetingLink(String meetingLink) { this.meetingLink = meetingLink; }

    public String getInterviewer() { return interviewer; }
    public void setInterviewer(String interviewer) { this.interviewer = interviewer; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<String> getChecklist() { return checklist; }
    public void setChecklist(List<String> checklist) { this.checklist = checklist; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
