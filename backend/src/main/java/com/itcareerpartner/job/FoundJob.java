package com.itcareerpartner.job;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "found_jobs")
public class FoundJob {

    @Id
    private String id;
    private String jobCode;
    private String title;
    private String company;
    private String location; // e.g. "Bengaluru • Hybrid"
    private String city; // e.g. "Bengaluru"
    private String ctcText; // e.g. "₹8.5 LPA (Confirmed)"
    private Double ctcLpa;
    private String fixedBase;
    private String jobType; // FULL_TIME, INTERNSHIP, TRAINEE
    private String workMode; // "Hybrid", "Remote", "On-site"
    private String interviewMode; // "VIRTUAL", "WALK_IN", "HYBRID"
    private String batchAllowed; // "2026 / 2025"
    private String experienceText; // "0 Years / Entry-Level"
    private String roleCategory;
    private String bondText; // "Zero Bond / No Service Agreement"
    private Integer jobMatchScore;
    private Integer resumeMatchScore;
    private List<String> skills;
    private String tag; // "Verified Fresher", "Paid Internship", "Review Details"
    private String status; // VERIFIED, REVIEW, FILTERED
    private String foundTimeText; // e.g. "25 mins ago"
    private String sourceName; // e.g. "Thoughtworks Official Career Page"
    private String applyUrl;
    private String logoText; // e.g. "TW"
    private String cautionNotice;
    private String filterReason;
    private String description;
    private String aboutCompany;
    private boolean isSaved;
    private Instant createdAt;

    public FoundJob() {
        this.createdAt = Instant.now();
        this.isSaved = false;
        this.status = "VERIFIED";
        this.tag = "Verified Fresher";
        this.bondText = "Zero Bond / No Service Agreement";
        this.experienceText = "0 Years / Fresher Scope";
        this.skills = new ArrayList<>();
        this.jobMatchScore = 88;
        this.resumeMatchScore = 85;
        this.workMode = "Hybrid";
        this.interviewMode = "VIRTUAL";
        this.batchAllowed = "2026 / 2025";
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

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getJobCode() { return jobCode; }
    public void setJobCode(String jobCode) { this.jobCode = jobCode; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getCtcText() { return ctcText; }
    public void setCtcText(String ctcText) { this.ctcText = ctcText; }

    public Double getCtcLpa() { return ctcLpa; }
    public void setCtcLpa(Double ctcLpa) { this.ctcLpa = ctcLpa; }

    public String getFixedBase() { return fixedBase; }
    public void setFixedBase(String fixedBase) { this.fixedBase = fixedBase; }

    public String getJobType() { return jobType; }
    public void setJobType(String jobType) { this.jobType = jobType; }

    public String getWorkMode() { return workMode; }
    public void setWorkMode(String workMode) { this.workMode = workMode; }

    public String getInterviewMode() { return interviewMode; }
    public void setInterviewMode(String interviewMode) { this.interviewMode = interviewMode; }

    public String getBatchAllowed() { return batchAllowed; }
    public void setBatchAllowed(String batchAllowed) { this.batchAllowed = batchAllowed; }

    public String getExperienceText() { return experienceText; }
    public void setExperienceText(String experienceText) { this.experienceText = experienceText; }

    public String getRoleCategory() { return roleCategory; }
    public void setRoleCategory(String roleCategory) { this.roleCategory = roleCategory; }

    public String getBondText() { return bondText; }
    public void setBondText(String bondText) { this.bondText = bondText; }

    public Integer getJobMatchScore() { return jobMatchScore; }
    public void setJobMatchScore(Integer jobMatchScore) { this.jobMatchScore = jobMatchScore; }

    public Integer getResumeMatchScore() { return resumeMatchScore; }
    public void setResumeMatchScore(Integer resumeMatchScore) { this.resumeMatchScore = resumeMatchScore; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getFoundTimeText() { return foundTimeText; }
    public void setFoundTimeText(String foundTimeText) { this.foundTimeText = foundTimeText; }

    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }

    public String getApplyUrl() { return applyUrl; }
    public void setApplyUrl(String applyUrl) { this.applyUrl = applyUrl; }

    public String getLogoText() { return logoText; }
    public void setLogoText(String logoText) { this.logoText = logoText; }

    public String getCautionNotice() { return cautionNotice; }
    public void setCautionNotice(String cautionNotice) { this.cautionNotice = cautionNotice; }

    public String getFilterReason() { return filterReason; }
    public void setFilterReason(String filterReason) { this.filterReason = filterReason; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAboutCompany() { return aboutCompany; }
    public void setAboutCompany(String aboutCompany) { this.aboutCompany = aboutCompany; }

    public boolean isSaved() { return isSaved; }
    public void setSaved(boolean saved) { isSaved = saved; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
