package com.itcareerpartner.auth;

import com.itcareerpartner.auth.dto.*;
import com.itcareerpartner.common.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:4173", "http://localhost:3000"}, allowCredentials = "true")
public class AuthController {

    private final AuthService authService;
    private final EmailService emailService;

    public AuthController(AuthService authService, EmailService emailService) {
        this.authService = authService;
        this.emailService = emailService;
    }

    @PostMapping({"/signup", "/register"})
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody SignUpRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiResponse.error("DUPLICATE_EMAIL", e.getMessage()));
        }
    }

    @PostMapping({"/signin", "/login"})
    public ResponseEntity<ApiResponse<UserProfileDto>> login(
            @Valid @RequestBody SignInRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {
        try {
            UserProfileDto profile = authService.login(request, httpRequest, httpResponse);
            return ResponseEntity.ok(ApiResponse.ok(profile));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("INVALID_CREDENTIALS", e.getMessage()));
        }
    }

    @PostMapping({"/signout", "/logout"})
    public ResponseEntity<ApiResponse<String>> logout(HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        authService.logout(httpRequest, httpResponse);
        return ResponseEntity.ok(ApiResponse.ok("Session successfully terminated."));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<ApiResponse<String>> verifyEmail(@RequestParam("token") String token) {
        try {
            authService.verifyEmail(token);
            return ResponseEntity.ok(ApiResponse.ok("Email address successfully verified!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("VERIFICATION_FAILED", e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.requestPasswordReset(request);
        return ResponseEntity.ok(ApiResponse.ok("If an account exists with this email, reset instructions have been sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            authService.resetPassword(request);
            return ResponseEntity.ok(ApiResponse.ok("Password reset successfully. You can now sign in with your new password."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("RESET_FAILED", e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileDto>> getCurrentUser(HttpServletRequest httpRequest) {
        UserProfileDto profile = authService.getCurrentUser(httpRequest);
        if (profile == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("UNAUTHENTICATED", "No active session found. Please sign in."));
        }
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileDto>> getProfile(HttpServletRequest httpRequest) {
        UserProfileDto profile = authService.getCurrentUser(httpRequest);
        if (profile == null) {
            UserProfileDto demo = new UserProfileDto(
                    "demo-user",
                    "Arjun Rao",
                    "arjun@college.edu",
                    true,
                    "2025",
                    "B.Tech CSE",
                    "Full-Stack Development"
            );
            demo.setPhone("98452 11094");
            demo.setCollegeName("RV College of Engineering, Bengaluru");
            demo.setSpecialization("Computer Science & Engineering");
            demo.setCgpa("8.4");
            demo.setSkills(List.of("Java", "Spring Boot", "PostgreSQL", "React", "Git"));
            demo.setTargetRoles(List.of("Backend Developer", "Software Engineer", "Java Developer", "QA / Test Automation Engineer"));
            demo.setPreferredLocations(List.of("Bengaluru", "Hyderabad", "Pune"));
            demo.setWorkModes(List.of("Hybrid", "On-site"));
            demo.setEmploymentTypes(List.of("Full-time Direct Hire", "Paid Technical Internships"));
            demo.setInterviewPreference("online");
            demo.setWorkingDaysPreference("5_days");
            demo.setSalaryFloorLpa(2.4);
            return ResponseEntity.ok(ApiResponse.ok(demo));
        }
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateProfile(
            @RequestBody UserProfileDto profileDto,
            HttpServletRequest httpRequest) {
        UserProfileDto updated = authService.updateProfile(profileDto, httpRequest);
        return ResponseEntity.ok(ApiResponse.ok(updated));
    }

    @GetMapping("/csrf")
    public ResponseEntity<ApiResponse<Map<String, String>>> getCsrfToken(HttpServletRequest request) {
        String csrfToken = UUID.randomUUID().toString();
        request.getSession(true).setAttribute("XSRF-TOKEN", csrfToken);
        return ResponseEntity.ok(ApiResponse.ok(Map.of("csrfToken", csrfToken, "headerName", "X-XSRF-TOKEN")));
    }

    @GetMapping("/test/inbox")
    public ResponseEntity<ApiResponse<List<OutboxEmailDto>>> getLocalInbox() {
        return ResponseEntity.ok(ApiResponse.ok(emailService.getRecentEmails()));
    }
}
