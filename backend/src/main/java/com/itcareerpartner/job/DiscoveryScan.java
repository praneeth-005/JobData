package com.itcareerpartner.job;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "discovery_scans")
public class DiscoveryScan {

    @Id
    private String id;
    private String userId;
    private String scope; // ALL, SINGLE
    private String targetCompanyName;
    private String targetSourceId;
    private String status; // IN_PROGRESS, COMPLETED, STOPPED
    private int progressPercent; // 0 - 100
    private int currentStepIndex; // 1 to 4
    private String currentCheckDescription;
    private int postingsScanned;
    private int fresherJobsFound;
    private int filteredOut;
    private int duplicatesIgnored;
    private Instant startedAt;
    private Instant completedAt;

    public DiscoveryScan() {
        this.startedAt = Instant.now();
        this.status = "IN_PROGRESS";
        this.progressPercent = 65;
        this.currentStepIndex = 3;
        this.currentCheckDescription = "Checking eligibility & salary requirements (≥ ₹2.4 LPA minimum)";
        this.postingsScanned = 72;
        this.fresherJobsFound = 34;
        this.filteredOut = 26;
        this.duplicatesIgnored = 12;
    }

    public DiscoveryScan(String userId, String scope, String targetCompanyName, String targetSourceId) {
        this();
        this.userId = userId;
        this.scope = scope;
        this.targetCompanyName = targetCompanyName;
        this.targetSourceId = targetSourceId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getScope() {
        return scope;
    }

    public void setScope(String scope) {
        this.scope = scope;
    }

    public String getTargetCompanyName() {
        return targetCompanyName;
    }

    public void setTargetCompanyName(String targetCompanyName) {
        this.targetCompanyName = targetCompanyName;
    }

    public String getTargetSourceId() {
        return targetSourceId;
    }

    public void setTargetSourceId(String targetSourceId) {
        this.targetSourceId = targetSourceId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getProgressPercent() {
        return progressPercent;
    }

    public void setProgressPercent(int progressPercent) {
        this.progressPercent = progressPercent;
    }

    public int getCurrentStepIndex() {
        return currentStepIndex;
    }

    public void setCurrentStepIndex(int currentStepIndex) {
        this.currentStepIndex = currentStepIndex;
    }

    public String getCurrentCheckDescription() {
        return currentCheckDescription;
    }

    public void setCurrentCheckDescription(String currentCheckDescription) {
        this.currentCheckDescription = currentCheckDescription;
    }

    public int getPostingsScanned() {
        return postingsScanned;
    }

    public void setPostingsScanned(int postingsScanned) {
        this.postingsScanned = postingsScanned;
    }

    public int getFresherJobsFound() {
        return fresherJobsFound;
    }

    public void setFresherJobsFound(int fresherJobsFound) {
        this.fresherJobsFound = fresherJobsFound;
    }

    public int getFilteredOut() {
        return filteredOut;
    }

    public void setFilteredOut(int filteredOut) {
        this.filteredOut = filteredOut;
    }

    public int getDuplicatesIgnored() {
        return duplicatesIgnored;
    }

    public void setDuplicatesIgnored(int duplicatesIgnored) {
        this.duplicatesIgnored = duplicatesIgnored;
    }

    public Instant getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(Instant startedAt) {
        this.startedAt = startedAt;
    }

    public Instant getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(Instant completedAt) {
        this.completedAt = completedAt;
    }
}
