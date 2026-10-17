package com.itcareerpartner.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class EducationCredential {
    private String id;
    private String category; // 'higher_ed', 'school', 'diploma'

    @NotBlank(message = "Education title cannot be empty")
    @Size(max = 120, message = "Education title must be under 120 characters")
    private String title;

    private String badge;
    private boolean isPrimary;

    @NotBlank(message = "Degree or qualification name is required")
    @Size(max = 150, message = "Qualification must be under 150 characters")
    private String qualification;

    private String gradYear;

    @Size(max = 150, message = "Specialization must be under 150 characters")
    private String specialization;

    @NotBlank(message = "Institution or college name is required")
    @Size(max = 200, message = "Institution name must be under 200 characters")
    private String institution;

    @Pattern(regexp = "^(cgpa|pct)$", message = "Score type must be 'cgpa' or 'pct'")
    private String scoreType = "cgpa";

    private String scoreValue;

    public EducationCredential() {}

    public EducationCredential(String id, String category, String title, String badge, boolean isPrimary,
                               String qualification, String gradYear, String specialization,
                               String institution, String scoreType, String scoreValue) {
        this.id = id;
        this.category = category;
        this.title = title;
        this.badge = badge;
        this.isPrimary = isPrimary;
        this.qualification = qualification;
        this.gradYear = gradYear;
        this.specialization = specialization;
        this.institution = institution;
        this.scoreType = scoreType;
        this.scoreValue = scoreValue;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }

    public boolean isPrimary() { return isPrimary; }
    public void setPrimary(boolean isPrimary) { this.isPrimary = isPrimary; }

    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }

    public String getGradYear() { return gradYear; }
    public void setGradYear(String gradYear) { this.gradYear = gradYear; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getInstitution() { return institution; }
    public void setInstitution(String institution) { this.institution = institution; }

    public String getScoreType() { return scoreType; }
    public void setScoreType(String scoreType) { this.scoreType = scoreType; }

    public String getScoreValue() { return scoreValue; }
    public void setScoreValue(String scoreValue) { this.scoreValue = scoreValue; }
}
