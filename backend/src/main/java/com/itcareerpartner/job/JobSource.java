package com.itcareerpartner.job;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.Locale;

@Document(collection = "job_sources")
public class JobSource {

    @Id
    private String id;

    @Indexed(unique = true)
    private String sourceKey;

    private String companyName;
    private String portalName;
    private String portalUrl;
    private String sourceType; // PORTAL, CAMPUS, API
    private String status; // ACTIVE, SLOWDOWN, PAUSED
    private String statusDescription; // e.g. "Active & Checking", "Retrying in 15 mins"
    private int fresherJobsCount;
    private String lastCheckedText; // e.g. "25 mins ago"
    private Instant lastCheckedAt;
    private String logoText; // e.g. "TW", "SW", "ZH"
    private Instant createdAt;
    private Instant updatedAt;

    public JobSource() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        this.status = "ACTIVE";
        this.statusDescription = "Active & Checking";
        this.lastCheckedText = "Just now";
        this.lastCheckedAt = Instant.now();
        this.sourceKey = "src_" + System.currentTimeMillis() + "_" + (int)(Math.random() * 1000);
    }

    public JobSource(String companyName, String portalName, String portalUrl, String sourceType, String logoText, int fresherJobsCount) {
        this();
        this.companyName = companyName;
        this.portalName = portalName;
        this.portalUrl = portalUrl;
        this.sourceType = sourceType;
        this.logoText = logoText;
        this.fresherJobsCount = fresherJobsCount;
        this.sourceKey = generateSourceKey(companyName);
    }

    public static String generateSourceKey(String name) {
        if (name == null || name.trim().isEmpty()) {
            return "src_" + System.currentTimeMillis() + "_" + (int)(Math.random() * 1000);
        }
        return "src_" + name.trim().toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]+", "_");
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSourceKey() {
        return sourceKey;
    }

    public void setSourceKey(String sourceKey) {
        this.sourceKey = sourceKey;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getPortalName() {
        return portalName;
    }

    public void setPortalName(String portalName) {
        this.portalName = portalName;
    }

    public String getPortalUrl() {
        return portalUrl;
    }

    public void setPortalUrl(String portalUrl) {
        this.portalUrl = portalUrl;
    }

    public String getSourceType() {
        return sourceType;
    }

    public void setSourceType(String sourceType) {
        this.sourceType = sourceType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatusDescription() {
        return statusDescription;
    }

    public void setStatusDescription(String statusDescription) {
        this.statusDescription = statusDescription;
    }

    public int getFresherJobsCount() {
        return fresherJobsCount;
    }

    public void setFresherJobsCount(int fresherJobsCount) {
        this.fresherJobsCount = fresherJobsCount;
    }

    public String getLastCheckedText() {
        return lastCheckedText;
    }

    public void setLastCheckedText(String lastCheckedText) {
        this.lastCheckedText = lastCheckedText;
    }

    public Instant getLastCheckedAt() {
        return lastCheckedAt;
    }

    public void setLastCheckedAt(Instant lastCheckedAt) {
        this.lastCheckedAt = lastCheckedAt;
    }

    public String getLogoText() {
        return logoText;
    }

    public void setLogoText(String logoText) {
        this.logoText = logoText;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
