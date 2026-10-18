package com.itcareerpartner.tracker;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "job_applications")
public class JobApplication {

    @Id
    private String id;
    private String userId;
    private String jobId;
    private String company;
    private String title;
    private String logoText;
    private String ctcText;
    private double ctcLpa;
    private String location;
    private String workMode;
    private String batchAllowed;
    private ApplicationStage stage;
    private String statusLabel;
    private String resumeVersionId;
    private String resumeVersionLabel;
    private String appliedDateFormatted;
    private Instant appliedDate;
    private String nextActionFormatted;
    private Instant nextActionDate;
    private String nextActionTitle;
    private String portalUrl;
    private String recruiterContact;
    private String notes;
    private int matchScore;
    private List<ApplicationTimelineItem> timeline = new ArrayList<>();
    private Instant createdAt;
    private Instant updatedAt;

    public JobApplication() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        this.stage = ApplicationStage.APPLIED;
        this.statusLabel = "Applied";
        this.batchAllowed = "2026 Batch";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getJobId() { return jobId; }
    public void setJobId(String jobId) { this.jobId = jobId; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getLogoText() { return logoText; }
    public void setLogoText(String logoText) { this.logoText = logoText; }

    public String getCtcText() { return ctcText; }
    public void setCtcText(String ctcText) { this.ctcText = ctcText; }

    public double getCtcLpa() { return ctcLpa; }
    public void setCtcLpa(double ctcLpa) { this.ctcLpa = ctcLpa; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getWorkMode() { return workMode; }
    public void setWorkMode(String workMode) { this.workMode = workMode; }

    public String getBatchAllowed() { return batchAllowed; }
    public void setBatchAllowed(String batchAllowed) { this.batchAllowed = batchAllowed; }

    public ApplicationStage getStage() { return stage; }
    public void setStage(ApplicationStage stage) { this.stage = stage; }

    public String getStatusLabel() { return statusLabel; }
    public void setStatusLabel(String statusLabel) { this.statusLabel = statusLabel; }

    public String getResumeVersionId() { return resumeVersionId; }
    public void setResumeVersionId(String resumeVersionId) { this.resumeVersionId = resumeVersionId; }

    public String getResumeVersionLabel() { return resumeVersionLabel; }
    public void setResumeVersionLabel(String resumeVersionLabel) { this.resumeVersionLabel = resumeVersionLabel; }

    public String getAppliedDateFormatted() { return appliedDateFormatted; }
    public void setAppliedDateFormatted(String appliedDateFormatted) { this.appliedDateFormatted = appliedDateFormatted; }

    public Instant getAppliedDate() { return appliedDate; }
    public void setAppliedDate(Instant appliedDate) { this.appliedDate = appliedDate; }

    public String getNextActionFormatted() { return nextActionFormatted; }
    public void setNextActionFormatted(String nextActionFormatted) { this.nextActionFormatted = nextActionFormatted; }

    public Instant getNextActionDate() { return nextActionDate; }
    public void setNextActionDate(Instant nextActionDate) { this.nextActionDate = nextActionDate; }

    public String getNextActionTitle() { return nextActionTitle; }
    public void setNextActionTitle(String nextActionTitle) { this.nextActionTitle = nextActionTitle; }

    public String getPortalUrl() { return portalUrl; }
    public void setPortalUrl(String portalUrl) { this.portalUrl = portalUrl; }

    public String getRecruiterContact() { return recruiterContact; }
    public void setRecruiterContact(String recruiterContact) { this.recruiterContact = recruiterContact; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public int getMatchScore() { return matchScore; }
    public void setMatchScore(int matchScore) { this.matchScore = matchScore; }

    public List<ApplicationTimelineItem> getTimeline() { return timeline; }
    public void setTimeline(List<ApplicationTimelineItem> timeline) { this.timeline = timeline; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
