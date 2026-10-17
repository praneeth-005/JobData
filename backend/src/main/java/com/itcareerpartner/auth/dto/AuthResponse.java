package com.itcareerpartner.auth.dto;

public class AuthResponse {
    private String userId;
    private String fullName;
    private String email;
    private boolean emailVerified;
    private String graduationYear;
    private String message;

    public AuthResponse() {}

    public AuthResponse(String userId, String fullName, String email, boolean emailVerified, String graduationYear, String message) {
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.emailVerified = emailVerified;
        this.graduationYear = graduationYear;
        this.message = message;
    }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }

    public String getGraduationYear() { return graduationYear; }
    public void setGraduationYear(String graduationYear) { this.graduationYear = graduationYear; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
