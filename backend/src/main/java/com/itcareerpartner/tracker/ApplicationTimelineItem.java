package com.itcareerpartner.tracker;

import java.time.Instant;

public class ApplicationTimelineItem {
    private String id;
    private String stageName;
    private String title;
    private String description;
    private String dateFormatted;
    private Instant timestamp;
    private boolean completed;
    private boolean current;
    private String icon;

    public ApplicationTimelineItem() {}

    public ApplicationTimelineItem(String id, String stageName, String title, String description, String dateFormatted, boolean completed, boolean current, String icon) {
        this.id = id;
        this.stageName = stageName;
        this.title = title;
        this.description = description;
        this.dateFormatted = dateFormatted;
        this.timestamp = Instant.now();
        this.completed = completed;
        this.current = current;
        this.icon = icon;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStageName() { return stageName; }
    public void setStageName(String stageName) { this.stageName = stageName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDateFormatted() { return dateFormatted; }
    public void setDateFormatted(String dateFormatted) { this.dateFormatted = dateFormatted; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public boolean isCurrent() { return current; }
    public void setCurrent(boolean current) { this.current = current; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
}
