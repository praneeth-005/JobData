package com.itcareerpartner.job;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "found_jobs")
public class FoundJob {

    @Id
    private String id;
    private String title;
    private String company;
    private String location; // e.g. "Bengaluru • Hybrid"
    private String city; // e.g. "Bengaluru"
    private String ctcText; // e.g. "₹8.5 LPA (Confirmed)"
    private Double ctcLpa;
    private String jobType; // FULL_TIME, INTERNSHIP, TRAINEE
    private String tag; // "Verified Fresher", "Paid Internship", "Review Details"
    private String status; // VERIFIED, REVIEW, FILTERED
    private String foundTimeText; // e.g. "25 mins ago"
    private String sourceName; // e.g. "Thoughtworks Official Career Page"
    private String applyUrl;
    private String logoText; // e.g. "TW"
    private String cautionNotice;
    private String filterReason;
    private boolean isSaved;
    private Instant createdAt;

    public FoundJob() {
        this.createdAt = Instant.now();
        this.isSaved = false;
        this.status = "VERIFIED";
        this.tag = "Verified Fresher";
    }

    public FoundJob(String title, String company, String location, String city, String ctcText, Double ctcLpa,
                    String jobType, String tag, String status, String foundTimeText, String sourceName,
                    String applyUrl, String logoText, String cautionNotice) {
        this();
        this.title = title;
        this.company = company;
        this.location = location;
        this.city = city;
        this.ctcText = ctcText;
        this.ctcLpa = ctcLpa;
        this.jobType = jobType;
        this.tag = tag;
        this.status = status;
        this.foundTimeText = foundTimeText;
        this.sourceName = sourceName;
        this.applyUrl = applyUrl;
        this.logoText = logoText;
        this.cautionNotice = cautionNotice;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCtcText() {
        return ctcText;
    }

    public void setCtcText(String ctcText) {
        this.ctcText = ctcText;
    }

    public Double getCtcLpa() {
        return ctcLpa;
    }

    public void setCtcLpa(Double ctcLpa) {
        this.ctcLpa = ctcLpa;
    }

    public String getJobType() {
        return jobType;
    }

    public void setJobType(String jobType) {
        this.jobType = jobType;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getFoundTimeText() {
        return foundTimeText;
    }

    public void setFoundTimeText(String foundTimeText) {
        this.foundTimeText = foundTimeText;
    }

    public String getSourceName() {
        return sourceName;
    }

    public void setSourceName(String sourceName) {
        this.sourceName = sourceName;
    }

    public String getApplyUrl() {
        return applyUrl;
    }

    public void setApplyUrl(String applyUrl) {
        this.applyUrl = applyUrl;
    }

    public String getLogoText() {
        return logoText;
    }

    public void setLogoText(String logoText) {
        this.logoText = logoText;
    }

    public String getCautionNotice() {
        return cautionNotice;
    }

    public void setCautionNotice(String cautionNotice) {
        this.cautionNotice = cautionNotice;
    }

    public String getFilterReason() {
        return filterReason;
    }

    public void setFilterReason(String filterReason) {
        this.filterReason = filterReason;
    }

    public boolean isSaved() {
        return isSaved;
    }

    public void setSaved(boolean saved) {
        isSaved = saved;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
