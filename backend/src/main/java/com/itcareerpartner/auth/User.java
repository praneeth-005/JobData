package com.itcareerpartner.auth;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
public class User {
    @Id
    private String id;

    private String fullName;

    private String email;

    @Indexed(unique = true)
    private String normalizedEmail;

    private String passwordHash;

    private String graduationYear;

    private String degree;

    private String targetTrack;

    private String phone;

    private String collegeName;

    private String specialization;

    private String cgpa;

    private List<EducationCredential> educationList = new ArrayList<>();

    private List<String> skills = new ArrayList<>();

    private List<String> targetRoles = new ArrayList<>();

    private List<String> preferredLocations = new ArrayList<>();

    private List<String> workModes = new ArrayList<>();

    private List<String> employmentTypes = new ArrayList<>();

    private String interviewPreference = "online";

    private String workingDaysPreference = "5_days";

    private Double salaryFloorLpa = 2.4;

    private boolean emailVerified;

    private Instant emailVerifiedAt;

    private Instant createdAt;

    private Instant updatedAt;

    public User() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        this.emailVerified = false;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) {
        this.email = email;
        this.normalizedEmail = email != null ? email.trim().toLowerCase() : null;
    }

    public String getNormalizedEmail() { return normalizedEmail; }
    public void setNormalizedEmail(String normalizedEmail) { this.normalizedEmail = normalizedEmail; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getGraduationYear() { return graduationYear; }
    public void setGraduationYear(String graduationYear) { this.graduationYear = graduationYear; }

    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }

    public String getTargetTrack() { return targetTrack; }
    public void setTargetTrack(String targetTrack) { this.targetTrack = targetTrack; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getCgpa() { return cgpa; }
    public void setCgpa(String cgpa) { this.cgpa = cgpa; }

    public List<EducationCredential> getEducationList() { return educationList; }
    public void setEducationList(List<EducationCredential> educationList) { this.educationList = educationList; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public List<String> getTargetRoles() { return targetRoles; }
    public void setTargetRoles(List<String> targetRoles) { this.targetRoles = targetRoles; }

    public List<String> getPreferredLocations() { return preferredLocations; }
    public void setPreferredLocations(List<String> preferredLocations) { this.preferredLocations = preferredLocations; }

    public List<String> getWorkModes() { return workModes; }
    public void setWorkModes(List<String> workModes) { this.workModes = workModes; }

    public List<String> getEmploymentTypes() { return employmentTypes; }
    public void setEmploymentTypes(List<String> employmentTypes) { this.employmentTypes = employmentTypes; }

    public String getInterviewPreference() { return interviewPreference; }
    public void setInterviewPreference(String interviewPreference) { this.interviewPreference = interviewPreference; }

    public String getWorkingDaysPreference() { return workingDaysPreference; }
    public void setWorkingDaysPreference(String workingDaysPreference) { this.workingDaysPreference = workingDaysPreference; }

    public Double getSalaryFloorLpa() { return salaryFloorLpa; }
    public void setSalaryFloorLpa(Double salaryFloorLpa) { this.salaryFloorLpa = salaryFloorLpa; }

    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }

    public Instant getEmailVerifiedAt() { return emailVerifiedAt; }
    public void setEmailVerifiedAt(Instant emailVerifiedAt) { this.emailVerifiedAt = emailVerifiedAt; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
