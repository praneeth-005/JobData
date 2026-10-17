package com.itcareerpartner.resume;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "resume_versions")
public class ResumeVersion {

    @Id
    private String id;
    private String userId;
    private int versionNumber;
    private String versionLabel; // "v2.1"
    private String fileName;
    private long fileSizeBytes;
    private String fileSizeFormatted;
    private String sha256Hash;
    private String storagePath;
    private String parsedText;
    private String extractedCandidateName;
    private String extractedEmail;
    private String extractedPhone;
    private String extractedDegree;
    private String extractedGraduationBatch;
    private Double extractedCgpa;
    private List<String> extractedSkills = new ArrayList<>();
    private List<ResumeProjectItem> extractedProjects = new ArrayList<>();
    private int atsScore;
    private int overallScore;
    private String status; // "READY", "PROCESSING", "FAILED"
    private String errorMessage;
    private boolean isCurrent;
    private Instant createdAt;

    public ResumeVersion() {
        this.createdAt = Instant.now();
        this.status = "READY";
        this.isCurrent = false;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public int getVersionNumber() { return versionNumber; }
    public void setVersionNumber(int versionNumber) { this.versionNumber = versionNumber; }

    public String getVersionLabel() { return versionLabel; }
    public void setVersionLabel(String versionLabel) { this.versionLabel = versionLabel; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public long getFileSizeBytes() { return fileSizeBytes; }
    public void setFileSizeBytes(long fileSizeBytes) { this.fileSizeBytes = fileSizeBytes; }

    public String getFileSizeFormatted() { return fileSizeFormatted; }
    public void setFileSizeFormatted(String fileSizeFormatted) { this.fileSizeFormatted = fileSizeFormatted; }

    public String getSha256Hash() { return sha256Hash; }
    public void setSha256Hash(String sha256Hash) { this.sha256Hash = sha256Hash; }

    public String getStoragePath() { return storagePath; }
    public void setStoragePath(String storagePath) { this.storagePath = storagePath; }

    public String getParsedText() { return parsedText; }
    public void setParsedText(String parsedText) { this.parsedText = parsedText; }

    public String getExtractedCandidateName() { return extractedCandidateName; }
    public void setExtractedCandidateName(String extractedCandidateName) { this.extractedCandidateName = extractedCandidateName; }

    public String getExtractedEmail() { return extractedEmail; }
    public void setExtractedEmail(String extractedEmail) { this.extractedEmail = extractedEmail; }

    public String getExtractedPhone() { return extractedPhone; }
    public void setExtractedPhone(String extractedPhone) { this.extractedPhone = extractedPhone; }

    public String getExtractedDegree() { return extractedDegree; }
    public void setExtractedDegree(String extractedDegree) { this.extractedDegree = extractedDegree; }

    public String getExtractedGraduationBatch() { return extractedGraduationBatch; }
    public void setExtractedGraduationBatch(String extractedGraduationBatch) { this.extractedGraduationBatch = extractedGraduationBatch; }

    public Double getExtractedCgpa() { return extractedCgpa; }
    public void setExtractedCgpa(Double extractedCgpa) { this.extractedCgpa = extractedCgpa; }

    public List<String> getExtractedSkills() { return extractedSkills; }
    public void setExtractedSkills(List<String> extractedSkills) { this.extractedSkills = extractedSkills; }

    public List<ResumeProjectItem> getExtractedProjects() { return extractedProjects; }
    public void setExtractedProjects(List<ResumeProjectItem> extractedProjects) { this.extractedProjects = extractedProjects; }

    public int getAtsScore() { return atsScore; }
    public void setAtsScore(int atsScore) { this.atsScore = atsScore; }

    public int getOverallScore() { return overallScore; }
    public void setOverallScore(int overallScore) { this.overallScore = overallScore; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public boolean isCurrent() { return isCurrent; }
    public void setCurrent(boolean current) { isCurrent = current; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
