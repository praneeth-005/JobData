package com.itcareerpartner.auth.dto;

public class UserProfileDto {
    private String id;
    private String fullName;
    private String email;
    private boolean emailVerified;
    private String graduationYear;
    private String degree;
    private String targetTrack;

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
}
