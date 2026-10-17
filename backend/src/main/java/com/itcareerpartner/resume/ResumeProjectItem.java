package com.itcareerpartner.resume;

import java.util.ArrayList;
import java.util.List;

public class ResumeProjectItem {
    private String title;
    private String role;
    private String techStack;
    private List<String> bulletPoints = new ArrayList<>();
    private String projectUrl;
    private String evidenceStrength; // e.g. "High Confidence (Lines 14-22)"

    public ResumeProjectItem() {}

    public ResumeProjectItem(String title, String role, String techStack, List<String> bulletPoints, String evidenceStrength) {
        this.title = title;
        this.role = role;
        this.techStack = techStack;
        this.bulletPoints = bulletPoints != null ? bulletPoints : new ArrayList<>();
        this.evidenceStrength = evidenceStrength;
    }

    public ResumeProjectItem(String title, String role, String techStack, List<String> bulletPoints, String projectUrl, String evidenceStrength) {
        this.title = title;
        this.role = role;
        this.techStack = techStack;
        this.bulletPoints = bulletPoints != null ? bulletPoints : new ArrayList<>();
        this.projectUrl = projectUrl;
        this.evidenceStrength = evidenceStrength;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getTechStack() { return techStack; }
    public void setTechStack(String techStack) { this.techStack = techStack; }

    public List<String> getBulletPoints() { return bulletPoints; }
    public void setBulletPoints(List<String> bulletPoints) { this.bulletPoints = bulletPoints; }

    public String getProjectUrl() { return projectUrl; }
    public void setProjectUrl(String projectUrl) { this.projectUrl = projectUrl; }

    public String getEvidenceStrength() { return evidenceStrength; }
    public void setEvidenceStrength(String evidenceStrength) { this.evidenceStrength = evidenceStrength; }
}
