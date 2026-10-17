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
import java.util.Base64;
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

        return new UserProfileDto(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.isEmailVerified(),
                user.getGraduationYear(),
                user.getDegree(),
                user.getTargetTrack()
        );
    }

    public void logout(HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        HttpSession session = httpRequest.getSession(false);
        if (session != null) {
            session.invalidate();
        }
    }

    public boolean verifyEmail(String token) {
        EmailToken emailToken = emailTokenRepository.findByTokenHashAndPurposeAndUsedFalse(token, "EMAIL_VERIFICATION")
                .orElseThrow(() -> new IllegalArgumentException("Invalid or already used verification token."));

        if (emailToken.getExpiresAt().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Verification token has expired.");
        }

        User user = userRepository.findById(emailToken.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found for token."));

        user.setEmailVerified(true);
        user.setEmailVerifiedAt(Instant.now());
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);

        emailToken.setUsed(true);
        emailTokenRepository.save(emailToken);

        return true;
    }

    public void requestPasswordReset(ForgotPasswordRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByNormalizedEmail(normalizedEmail);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String rawToken = generateSecureToken();
            EmailToken emailToken = new EmailToken(
                    rawToken,
                    user.getId(),
                    user.getEmail(),
                    "PASSWORD_RESET",
                    Instant.now().plus(Duration.ofMinutes(15)) // 15 mins expiry
            );
            emailTokenRepository.save(emailToken);
            emailService.sendPasswordResetEmail(user.getEmail(), rawToken);
        }
    }

    public boolean resetPassword(ResetPasswordRequest request) {
        EmailToken emailToken = emailTokenRepository.findByTokenHashAndPurposeAndUsedFalse(request.getToken(), "PASSWORD_RESET")
                .orElseThrow(() -> new IllegalArgumentException("Invalid, expired, or already used password reset token."));

        if (emailToken.getExpiresAt().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Password reset token has expired.");
        }

        User user = userRepository.findById(emailToken.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        // Hash new password securely with BCrypt
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
        if (session == null || session.getAttribute(SESSION_USER_KEY) == null) {
            return null;
        }

        String userId = (String) session.getAttribute(SESSION_USER_KEY);
        return userRepository.findById(userId)
                .map(u -> new UserProfileDto(
                        u.getId(),
                        u.getFullName(),
                        u.getEmail(),
                        u.isEmailVerified(),
                        u.getGraduationYear(),
                        u.getDegree(),
                        u.getTargetTrack()
                ))
                .orElse(null);
    }

    private String generateSecureToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
