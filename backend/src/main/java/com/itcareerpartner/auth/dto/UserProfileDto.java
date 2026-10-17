package com.itcareerpartner.auth.dto;

import com.itcareerpartner.auth.EducationCredential;
import java.util.ArrayList;
import java.util.List;

public class UserProfileDto {
    private String id;
    private String fullName;
    private String email;
    private boolean emailVerified;
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

    public UserProfileDto() {}

    public UserProfileDto(String id, String fullName, String email, boolean emailVerified, String graduationYear, String degree, String targetTrack) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.emailVerified = emailVerified;
        this.graduationYear = graduationYear;
        this.degree = degree;
        this.targetTrack = targetTrack;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }

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
}
