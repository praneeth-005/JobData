package com.itcareerpartner.tracker;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "saved_jobs")
public class SavedJobItem {

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
    private String jobType;
    private int jobMatchScore;
    private String applyUrl;
    private String deadlineText;
    private String verificationStatus; // "VERIFIED_ELIGIBLE", "NEEDS_REVIEW", "CLOSED"
    private List<String> tags = new ArrayList<>();
    private String notes;
    private Instant savedAt;

    public SavedJobItem() {
        this.savedAt = Instant.now();
        this.verificationStatus = "VERIFIED_ELIGIBLE";
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

    public String getJobType() { return jobType; }
    public void setJobType(String jobType) { this.jobType = jobType; }

    public int getJobMatchScore() { return jobMatchScore; }
    public void setJobMatchScore(int jobMatchScore) { this.jobMatchScore = jobMatchScore; }

    public String getApplyUrl() { return applyUrl; }
    public void setApplyUrl(String applyUrl) { this.applyUrl = applyUrl; }

    public String getDeadlineText() { return deadlineText; }
    public void setDeadlineText(String deadlineText) { this.deadlineText = deadlineText; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Instant getSavedAt() { return savedAt; }
    public void setSavedAt(Instant savedAt) { this.savedAt = savedAt; }
}
