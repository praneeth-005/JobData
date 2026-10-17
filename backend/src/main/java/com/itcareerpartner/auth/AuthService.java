package com.itcareerpartner.auth;

import com.itcareerpartner.auth.dto.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class AuthService {
    public static final String SESSION_USER_KEY = "CURRENT_AUTHENTICATED_USER";

    private final UserRepository userRepository;
    private final EmailTokenRepository emailTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthService(UserRepository userRepository,
                       EmailTokenRepository emailTokenRepository,
                       PasswordEncoder passwordEncoder,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.emailTokenRepository = emailTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public AuthResponse register(SignUpRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        // 1. Check duplicate emails
        if (userRepository.existsByNormalizedEmail(normalizedEmail)) {
            throw new IllegalArgumentException("Email address is already registered.");
        }

        // 2. Hash password with BCrypt
        String passwordHash = passwordEncoder.encode(request.getPassword());

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(request.getEmail().trim());
        user.setNormalizedEmail(normalizedEmail);
        user.setPasswordHash(passwordHash);
        user.setGraduationYear(request.getGraduationYear());
        user.setDegree(request.getDegree());
        user.setTargetTrack(request.getTargetTrack());
        user.setEmailVerified(false);
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());

        // Default primary credential
        if (request.getDegree() != null && !request.getDegree().isBlank()) {
            user.getEducationList().add(new EducationCredential(
                    "edu_primary",
                    "higher_ed",
                    "Primary Degree",
                    "Current Qualification",
                    true,
                    request.getDegree(),
                    request.getGraduationYear() != null ? request.getGraduationYear() : "2027",
                    "Engineering / Computer Science",
                    "Registered Institution",
                    "cgpa",
                    "8.4"
            ));
        }

        User savedUser = userRepository.save(user);

        // 3. Generate verification token (expires in 24 hours)
        String rawToken = generateSecureToken();
        EmailToken emailToken = new EmailToken(
                rawToken,
                savedUser.getId(),
                savedUser.getEmail(),
                "EMAIL_VERIFICATION",
                Instant.now().plus(Duration.ofHours(24))
        );
        emailTokenRepository.save(emailToken);

        // 4. Send email via local testing setup
        emailService.sendVerificationEmail(savedUser.getEmail(), rawToken);

        return new AuthResponse(
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.isEmailVerified(),
                savedUser.getGraduationYear(),
                "Registration successful. Verification email dispatched to local outbox."
        );
    }

    public UserProfileDto login(SignInRequest request, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByNormalizedEmail(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        // Setup session
        HttpSession session = httpRequest.getSession(true);
        session.setAttribute(SESSION_USER_KEY, user.getId());

        return mapToDto(user);
    }

    public void logout(HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        HttpSession session = httpRequest.getSession(false);
        if (session != null) {
            session.removeAttribute(SESSION_USER_KEY);
            session.invalidate();
        }
    }

    public boolean verifyEmail(String token) {
        EmailToken emailToken = emailTokenRepository.findByTokenHashAndPurposeAndUsedFalse(token, "EMAIL_VERIFICATION")
                .orElseThrow(() -> new IllegalArgumentException("Invalid or unrecognized verification token."));

        if (emailToken.getExpiresAt().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Verification token has expired. Please request a new verification link.");
        }

        User user = userRepository.findById(emailToken.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found for this token."));

        user.setEmailVerified(true);
        user.setEmailVerifiedAt(Instant.now());
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);

        // Mark single-use token as used
        emailToken.setUsed(true);
        emailTokenRepository.save(emailToken);

        return true;
    }

    public void requestPasswordReset(ForgotPasswordRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        Optional<User> userOptional = userRepository.findByNormalizedEmail(normalizedEmail);

        if (userOptional.isEmpty()) {
            return;
        }

        User user = userOptional.get();
        String rawToken = generateSecureToken();
        EmailToken resetToken = new EmailToken(
                rawToken,
                user.getId(),
                user.getEmail(),
                "PASSWORD_RESET",
                Instant.now().plus(Duration.ofMinutes(15))
        );
        emailTokenRepository.save(resetToken);

        emailService.sendPasswordResetEmail(user.getEmail(), rawToken);
    }

    public boolean resetPassword(ResetPasswordRequest request) {
        EmailToken emailToken = emailTokenRepository.findByTokenHashAndPurposeAndUsedFalse(request.getToken(), "PASSWORD_RESET")
                .orElseThrow(() -> new IllegalArgumentException("Invalid or already used password reset token."));

        if (emailToken.getExpiresAt().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Password reset token has expired.");
        }

        User user = userRepository.findById(emailToken.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);

        // Mark single-use token as used
        emailToken.setUsed(true);
        emailTokenRepository.save(emailToken);

        return true;
    }

    public UserProfileDto getCurrentUser(HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        String userId = session != null ? (String) session.getAttribute(SESSION_USER_KEY) : null;

        if (userId != null) {
            return userRepository.findById(userId).map(this::mapToDto).orElse(null);
        }

        return null;
    }

    public UserProfileDto updateProfile(UserProfileDto profileDto, HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        String userId = session != null ? (String) session.getAttribute(SESSION_USER_KEY) : null;
        User user = null;

        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        } else if (profileDto.getEmail() != null && !profileDto.getEmail().isBlank()) {
            user = userRepository.findByNormalizedEmail(profileDto.getEmail().trim().toLowerCase()).orElse(null);
        }

        if (user == null) {
            throw new IllegalArgumentException("Authentication required: Please sign in to edit your profile and preferences.");
        }

        // Security check: Candidate can only edit their own profile
        if (userId != null && !user.getId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized: You can only view and edit your own profile.");
        }

        // 1. Validate and update Full Name
        if (profileDto.getFullName() != null) {
            String name = profileDto.getFullName().trim();
            if (name.length() < 2 || name.length() > 100) {
                throw new IllegalArgumentException("Full legal name must be between 2 and 100 characters.");
            }
            user.setFullName(name);
        }

        // 2. Validate and update Phone Number
        if (profileDto.getPhone() != null && !profileDto.getPhone().isBlank()) {
            String cleanPhone = profileDto.getPhone().replaceAll("[\\s\\-\\(\\)]", "");
            if (!cleanPhone.matches("^\\+?[0-9]{10,15}$")) {
                throw new IllegalArgumentException("Phone number must contain between 10 and 15 digits.");
            }
            user.setPhone(profileDto.getPhone().trim());
        }

        // 3. Process & Validate Education Credentials List
        if (profileDto.getEducationList() != null) {
            List<EducationCredential> validatedList = new ArrayList<>();
            for (EducationCredential edu : profileDto.getEducationList()) {
                if (edu == null) continue;

                String qual = edu.getQualification() != null ? edu.getQualification().trim() : "";
                String inst = edu.getInstitution() != null ? edu.getInstitution().trim() : "";
                if (qual.isBlank() && inst.isBlank()) {
                    continue; // Skip empty row
                }

                // Score boundary validation
                if (edu.getScoreValue() != null && !edu.getScoreValue().isBlank()) {
                    try {
                        double score = Double.parseDouble(edu.getScoreValue().trim());
                        if ("cgpa".equalsIgnoreCase(edu.getScoreType())) {
                            if (score < 0.0 || score > 10.0) {
                                throw new IllegalArgumentException("CGPA must be between 0.0 and 10.0 (received " + score + ").");
                            }
                        } else {
                            if (score < 0.0 || score > 100.0) {
                                throw new IllegalArgumentException("Percentage aggregate must be between 0.0 and 100.0 (received " + score + ").");
                            }
                        }
                    } catch (NumberFormatException ex) {
                        throw new IllegalArgumentException("Academic score must be a valid numeric figure (e.g. 8.4 or 85.0).");
                    }
                }

                // Graduation year sanity validation
                if (edu.getGradYear() != null && !edu.getGradYear().isBlank()) {
                    String rawYear = edu.getGradYear().replaceAll("[^0-9]", "");
                    if (rawYear.length() >= 4) {
                        int year = Integer.parseInt(rawYear.substring(0, 4));
                        if (year < 1980 || year > 2035) {
                            throw new IllegalArgumentException("Graduation year must be between 1980 and 2035.");
                        }
                    }
                }

                validatedList.add(edu);
            }

            // Ensure exactly one primary credential if credentials exist
            if (!validatedList.isEmpty() && !validatedList.stream().anyMatch(EducationCredential::isPrimary)) {
                validatedList.get(0).setPrimary(true);
                validatedList.get(0).setBadge("Current Qualification");
            }

            // Persist the entire list into MongoDB (any removed item is cleanly deleted)
            user.setEducationList(validatedList);

            // Synchronize primary degree fields on the User document
            EducationCredential primary = validatedList.stream()
                    .filter(EducationCredential::isPrimary)
                    .findFirst()
                    .orElse(validatedList.isEmpty() ? null : validatedList.get(0));

            if (primary != null) {
                user.setDegree(primary.getQualification());
                user.setGraduationYear(primary.getGradYear());
                user.setSpecialization(primary.getSpecialization());
                user.setCollegeName(primary.getInstitution());
                user.setCgpa(primary.getScoreValue());
            } else {
                user.setDegree("");
                user.setGraduationYear("");
                user.setSpecialization("");
                user.setCollegeName("");
                user.setCgpa("");
            }
        } else {
            // Direct field fallback updates if educationList is not sent
            if (profileDto.getGraduationYear() != null) user.setGraduationYear(profileDto.getGraduationYear());
            if (profileDto.getDegree() != null) user.setDegree(profileDto.getDegree());
            if (profileDto.getCollegeName() != null) user.setCollegeName(profileDto.getCollegeName().trim());
            if (profileDto.getSpecialization() != null) user.setSpecialization(profileDto.getSpecialization().trim());
            if (profileDto.getCgpa() != null) user.setCgpa(profileDto.getCgpa().trim());
        }

        // 4. Skills & Preferences Updates
        if (profileDto.getSkills() != null) {
            List<String> sanitizedSkills = profileDto.getSkills().stream()
                    .filter(s -> s != null && !s.isBlank())
                    .map(String::trim)
                    .distinct()
                    .limit(50)
                    .toList();
            user.setSkills(sanitizedSkills);
        }
        if (profileDto.getTargetRoles() != null) {
            List<String> sanitizedRoles = profileDto.getTargetRoles().stream()
                    .filter(r -> r != null && !r.isBlank())
                    .map(String::trim)
                    .distinct()
                    .limit(25)
                    .toList();
            user.setTargetRoles(sanitizedRoles);
        }
        if (profileDto.getPreferredLocations() != null) {
            List<String> sanitizedLocs = profileDto.getPreferredLocations().stream()
                    .filter(l -> l != null && !l.isBlank())
                    .map(String::trim)
                    .distinct()
                    .limit(20)
                    .toList();
            user.setPreferredLocations(sanitizedLocs);
        }
        if (profileDto.getWorkModes() != null) {
            user.setWorkModes(profileDto.getWorkModes().stream().filter(m -> m != null && !m.isBlank()).map(String::trim).distinct().toList());
        }
        if (profileDto.getEmploymentTypes() != null) {
            user.setEmploymentTypes(profileDto.getEmploymentTypes().stream().filter(t -> t != null && !t.isBlank()).map(String::trim).distinct().toList());
        }
        if (profileDto.getInterviewPreference() != null) {
            user.setInterviewPreference(profileDto.getInterviewPreference().trim());
        }
        if (profileDto.getWorkingDaysPreference() != null) {
            user.setWorkingDaysPreference(profileDto.getWorkingDaysPreference().trim());
        }

        // 5. Mandatory salary & stipend rules enforcement (BR-02: >= 2.4 LPA)
        if (profileDto.getSalaryFloorLpa() != null) {
            if (profileDto.getSalaryFloorLpa() < 2.4) {
                throw new IllegalArgumentException("Statutory salary floor cannot be less than 2.4 LPA (BR-02 compliance requirement).");
            }
            user.setSalaryFloorLpa(profileDto.getSalaryFloorLpa());
        }

        user.setUpdatedAt(Instant.now());
        User saved = userRepository.save(user);
        return mapToDto(saved);
    }

    public UserProfileDto mapToDto(User u) {
        UserProfileDto dto = new UserProfileDto(
                u.getId(),
                u.getFullName(),
                u.getEmail(),
                u.isEmailVerified(),
                u.getGraduationYear(),
                u.getDegree(),
                u.getTargetTrack()
        );
        dto.setPhone(u.getPhone());
        dto.setCollegeName(u.getCollegeName());
        dto.setSpecialization(u.getSpecialization());
        dto.setCgpa(u.getCgpa());

        // Map education list; if empty, initialize default primary degree from user fields
        List<EducationCredential> edus = u.getEducationList();
        if (edus == null || edus.isEmpty()) {
            edus = new ArrayList<>();
            if (u.getDegree() != null && !u.getDegree().isBlank()) {
                edus.add(new EducationCredential(
                        "edu_primary",
                        "higher_ed",
                        "Primary Degree",
                        "Current Qualification",
                        true,
                        u.getDegree(),
                        u.getGraduationYear() != null ? u.getGraduationYear() : "2027",
                        u.getSpecialization() != null ? u.getSpecialization() : "Computer Science & Engineering",
                        u.getCollegeName() != null ? u.getCollegeName() : "RV College of Engineering, Bengaluru",
                        "cgpa",
                        u.getCgpa() != null ? u.getCgpa() : "8.4"
                ));
            }
        }
        dto.setEducationList(edus);

        dto.setSkills(u.getSkills() != null ? u.getSkills() : new ArrayList<>());
        dto.setTargetRoles(u.getTargetRoles() != null ? u.getTargetRoles() : new ArrayList<>());
        dto.setPreferredLocations(u.getPreferredLocations() != null ? u.getPreferredLocations() : new ArrayList<>());
        dto.setWorkModes(u.getWorkModes() != null ? u.getWorkModes() : new ArrayList<>());
        dto.setEmploymentTypes(u.getEmploymentTypes() != null ? u.getEmploymentTypes() : new ArrayList<>());
        dto.setInterviewPreference(u.getInterviewPreference());
        dto.setWorkingDaysPreference(u.getWorkingDaysPreference());
        dto.setSalaryFloorLpa(u.getSalaryFloorLpa());
        return dto;
    }

    private String generateSecureToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
