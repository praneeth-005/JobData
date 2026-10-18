package com.itcareerpartner.notification;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Document(collection = "notifications")
public class NotificationItem {

    @Id
    private String id;
    private String userId;
    private String type; // JOB_ALERT, INTERVIEW_REMINDER, FOLLOW_UP_OVERDUE, WALK_IN_DRIVE, SYSTEM_UPDATE
    private String title;
    private String message;
    private String company;
    private String logoText;
    private String ctcText;
    private String location;
    private String batchAllowed;
    private int matchScore;
    private String linkUrl;
    private String actionLabel;
    private boolean read;
    private Instant createdAt;
    private String timeAgoFormatted;
    private List<String> tags = new ArrayList<>();
    private Map<String, String> metadata = new HashMap<>();

    public NotificationItem() {
        this.createdAt = Instant.now();
        this.read = false;
        this.batchAllowed = "2026 Batch";
    }

    public NotificationItem(String id, String userId, String type, String title, String message,
                            String company, String logoText, String ctcText, String location,
                            int matchScore, String linkUrl, String actionLabel, String timeAgoFormatted) {
        this();
        this.id = id;
        this.userId = userId;
        this.type = type;
        this.title = title;
        this.message = message;
        this.company = company;
        this.logoText = logoText;
        this.ctcText = ctcText;
        this.location = location;
        this.matchScore = matchScore;
        this.linkUrl = linkUrl;
        this.actionLabel = actionLabel;
        this.timeAgoFormatted = timeAgoFormatted;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getLogoText() { return logoText; }
    public void setLogoText(String logoText) { this.logoText = logoText; }

    public String getCtcText() { return ctcText; }
    public void setCtcText(String ctcText) { this.ctcText = ctcText; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getBatchAllowed() { return batchAllowed; }
    public void setBatchAllowed(String batchAllowed) { this.batchAllowed = batchAllowed; }

    public int getMatchScore() { return matchScore; }
    public void setMatchScore(int matchScore) { this.matchScore = matchScore; }

    public String getLinkUrl() { return linkUrl; }
    public void setLinkUrl(String linkUrl) { this.linkUrl = linkUrl; }

    public String getActionLabel() { return actionLabel; }
    public void setActionLabel(String actionLabel) { this.actionLabel = actionLabel; }

    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public String getTimeAgoFormatted() { return timeAgoFormatted; }
    public void setTimeAgoFormatted(String timeAgoFormatted) { this.timeAgoFormatted = timeAgoFormatted; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public Map<String, String> getMetadata() { return metadata; }
    public void setMetadata(Map<String, String> metadata) { this.metadata = metadata; }
}
