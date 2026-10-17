package com.itcareerpartner.resume;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "resume_analyses")
public class ResumeAnalysis {

    @Id
    private String id;
    private String resumeVersionId;
    private String userId;
    private String targetJobId;
    private String targetCompany;
    private String targetRoleTitle;
    private int jobMatchScore;
    private int resumeMatchScore;
    private int atsScore;
    private List<EvidenceItem> confirmedEvidence = new ArrayList<>();
    private List<String> missingPrerequisites = new ArrayList<>();
    private List<String> weakEvidence = new ArrayList<>();
    private List<BulletImprovementItem> honestSuggestions = new ArrayList<>();
    private List<MatchFactorItem> matchFactors = new ArrayList<>();
    private String aiProvider;
    private Instant createdAt;

    public ResumeAnalysis() {
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getResumeVersionId() { return resumeVersionId; }
    public void setResumeVersionId(String resumeVersionId) { this.resumeVersionId = resumeVersionId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getTargetJobId() { return targetJobId; }
    public void setTargetJobId(String targetJobId) { this.targetJobId = targetJobId; }

    public String getTargetCompany() { return targetCompany; }
    public void setTargetCompany(String targetCompany) { this.targetCompany = targetCompany; }

    public String getTargetRoleTitle() { return targetRoleTitle; }
    public void setTargetRoleTitle(String targetRoleTitle) { this.targetRoleTitle = targetRoleTitle; }

    public int getJobMatchScore() { return jobMatchScore; }
    public void setJobMatchScore(int jobMatchScore) { this.jobMatchScore = jobMatchScore; }

    public int getResumeMatchScore() { return resumeMatchScore; }
    public void setResumeMatchScore(int resumeMatchScore) { this.resumeMatchScore = resumeMatchScore; }

    public int getAtsScore() { return atsScore; }
    public void setAtsScore(int atsScore) { this.atsScore = atsScore; }

    public List<EvidenceItem> getConfirmedEvidence() { return confirmedEvidence; }
    public void setConfirmedEvidence(List<EvidenceItem> confirmedEvidence) { this.confirmedEvidence = confirmedEvidence; }

    public List<String> getMissingPrerequisites() { return missingPrerequisites; }
    public void setMissingPrerequisites(List<String> missingPrerequisites) { this.missingPrerequisites = missingPrerequisites; }

    public List<String> getWeakEvidence() { return weakEvidence; }
    public void setWeakEvidence(List<String> weakEvidence) { this.weakEvidence = weakEvidence; }

    public List<BulletImprovementItem> getHonestSuggestions() { return honestSuggestions; }
    public void setHonestSuggestions(List<BulletImprovementItem> honestSuggestions) { this.honestSuggestions = honestSuggestions; }

    public List<MatchFactorItem> getMatchFactors() { return matchFactors; }
    public void setMatchFactors(List<MatchFactorItem> matchFactors) { this.matchFactors = matchFactors; }

    public String getAiProvider() { return aiProvider; }
    public void setAiProvider(String aiProvider) { this.aiProvider = aiProvider; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
