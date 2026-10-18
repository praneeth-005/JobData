package com.itcareerpartner.auth;

import com.itcareerpartner.auth.dto.*;
import org.junit.jupiter.api.*;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Isolated Authentication & Lifecycle Unit Test Suite.
 * Validates registration, duplicate rejection, BCrypt hashing, local email tokens,
 * session management, and single-use password resets with 100% test isolation.
 */
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class AuthIntegrationTest {

    private AuthService authService;
    private UserRepository userRepository;
    private EmailTokenRepository emailTokenRepository;
    private EmailService emailService;
    private PasswordEncoder passwordEncoder;

    private final Map<String, User> userDb = new ConcurrentHashMap<>();
    private final Map<String, EmailToken> tokenDb = new ConcurrentHashMap<>();

    private static String testEmail;
    private static final String testPassword = "SuperSecurePassword123!";

    @BeforeAll
    public void setup() {
        testEmail = "test.fresher." + UUID.randomUUID().toString().substring(0, 8) + "@college.edu";

        userRepository = mock(UserRepository.class);
        emailTokenRepository = mock(EmailTokenRepository.class);
        emailService = new EmailService();
        passwordEncoder = new BCryptPasswordEncoder(12);

        // Configure isolated in-memory mock repository for UserRepository
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            if (u.getId() == null) {
                u.setId("user_" + UUID.randomUUID().toString().substring(0, 8));
            }
            userDb.put(u.getId(), u);
            return u;
        });

        when(userRepository.findByNormalizedEmail(anyString())).thenAnswer(inv -> {
            String norm = inv.getArgument(0);
            return userDb.values().stream()
                    .filter(u -> norm != null && norm.equalsIgnoreCase(u.getNormalizedEmail()))
                    .findFirst();
        });

        when(userRepository.existsByNormalizedEmail(anyString())).thenAnswer(inv -> {
            String norm = inv.getArgument(0);
            return userDb.values().stream()
                    .anyMatch(u -> norm != null && norm.equalsIgnoreCase(u.getNormalizedEmail()));
        });

        when(userRepository.findById(anyString())).thenAnswer(inv -> {
            String id = inv.getArgument(0);
            return Optional.ofNullable(userDb.get(id));
        });

        doAnswer(inv -> {
            User u = inv.getArgument(0);
            if (u != null && u.getId() != null) {
                userDb.remove(u.getId());
            }
            return null;
        }).when(userRepository).delete(any(User.class));

        // Configure isolated in-memory mock repository for EmailTokenRepository
        when(emailTokenRepository.save(any(EmailToken.class))).thenAnswer(inv -> {
            EmailToken t = inv.getArgument(0);
            if (t.getId() == null) {
                t.setId("tok_" + UUID.randomUUID().toString().substring(0, 8));
            }
            tokenDb.put(t.getTokenHash(), t);
            return t;
        });

        when(emailTokenRepository.findByTokenHashAndPurposeAndUsedFalse(anyString(), anyString())).thenAnswer(inv -> {
            String hash = inv.getArgument(0);
            String purpose = inv.getArgument(1);
            EmailToken t = tokenDb.get(hash);
            if (t != null && !t.isUsed() && purpose.equalsIgnoreCase(t.getPurpose())) {
                return Optional.of(t);
            }
            return Optional.empty();
        });

        when(emailTokenRepository.findByUserIdAndPurpose(anyString(), anyString())).thenAnswer(inv -> {
            String uid = inv.getArgument(0);
            String purpose = inv.getArgument(1);
            return tokenDb.values().stream()
                    .filter(t -> uid.equals(t.getUserId()) && purpose.equalsIgnoreCase(t.getPurpose()))
                    .toList();
        });

        doAnswer(inv -> {
            EmailToken t = inv.getArgument(0);
            if (t != null && t.getTokenHash() != null) {
                tokenDb.remove(t.getTokenHash());
            }
            return null;
        }).when(emailTokenRepository).delete(any(EmailToken.class));

        authService = new AuthService(userRepository, emailTokenRepository, passwordEncoder, emailService);
    }

    @Test
    @Order(1)
    @DisplayName("1. Register new user, persist in repository, hash password with BCrypt, reject duplicate emails")
    public void test1_RegisterAndDuplicateRejection() {
        // Register new user
        SignUpRequest req = new SignUpRequest();
        req.setFullName("Aditya Candidate");
        req.setEmail(testEmail);
        req.setPassword(testPassword);
        req.setGraduationYear("2025 Batch");
        req.setDegree("B.Tech Computer Science");
        req.setTargetTrack("Full Stack");
        req.setAgreeCharter(true);

        var response = authService.register(req);
        assertNotNull(response.getUserId());
        assertEquals("Aditya Candidate", response.getFullName());

        // Verify persistence in repository
        User user = userRepository.findByNormalizedEmail(testEmail.toLowerCase()).orElse(null);
        assertNotNull(user, "User must be persisted in repository");
        assertEquals("Aditya Candidate", user.getFullName());
        assertFalse(user.isEmailVerified(), "New user should not be verified yet");

        // Verify password is BCrypt hashed (NOT plain text)
        assertNotEquals(testPassword, user.getPasswordHash(), "Password must NEVER be stored as plain text");
        assertTrue(user.getPasswordHash().startsWith("$2a$") || user.getPasswordHash().startsWith("$2b$"),
                "Password must be hashed using BCrypt");
        assertTrue(passwordEncoder.matches(testPassword, user.getPasswordHash()),
                "BCrypt hash must match original password");

        // Verify duplicate email is REJECTED
        SignUpRequest duplicateReq = new SignUpRequest();
        duplicateReq.setFullName("Duplicate User");
        duplicateReq.setEmail(testEmail.toUpperCase()); // Test case-insensitive duplicate check
        duplicateReq.setPassword("AnotherPassword123!");
        duplicateReq.setAgreeCharter(true);

        assertThrows(IllegalArgumentException.class, () -> {
            authService.register(duplicateReq);
        }, "Duplicate email registration must be rejected");
    }

    @Test
    @Order(2)
    @DisplayName("2. Email verification works using local email-testing setup")
    public void test2_EmailVerificationLocalSetup() {
        // Retrieve sent email from local outbox
        List<OutboxEmailDto> emails = emailService.getRecentEmails();
        assertFalse(emails.isEmpty(), "Local email outbox must contain dispatched verification email");

        OutboxEmailDto verificationEmail = emails.stream()
                .filter(e -> e.getRecipient().equalsIgnoreCase(testEmail) && "EMAIL_VERIFICATION".equals(e.getPurpose()))
                .findFirst()
                .orElse(null);

        assertNotNull(verificationEmail, "Verification email must be present in local testing inbox");
        assertNotNull(verificationEmail.getToken(), "Verification token must be present");

        // Verify email using the token
        boolean verified = authService.verifyEmail(verificationEmail.getToken());
        assertTrue(verified, "verifyEmail must return true for valid token");

        // Check user in repository is now emailVerified = true
        User user = userRepository.findByNormalizedEmail(testEmail.toLowerCase()).orElseThrow();
        assertTrue(user.isEmailVerified(), "User status in repository must be emailVerified = true");
        assertNotNull(user.getEmailVerifiedAt(), "Verification timestamp must be set");
    }

    @Test
    @Order(3)
    @DisplayName("3. Login and logout work correctly with session management")
    public void test3_LoginAndLogout() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        // 1. Invalid password -> should fail
        SignInRequest invalidReq = new SignInRequest();
        invalidReq.setEmail(testEmail);
        invalidReq.setPassword("WrongPassword999!");
        assertThrows(IllegalArgumentException.class, () -> {
            authService.login(invalidReq, request, response);
        }, "Login with wrong password must throw exception");

        // 2. Correct credentials -> should succeed & create session
        SignInRequest validReq = new SignInRequest();
        validReq.setEmail(testEmail);
        validReq.setPassword(testPassword);
        var profile = authService.login(validReq, request, response);

        assertNotNull(profile);
        assertEquals("Aditya Candidate", profile.getFullName());
        assertNotNull(request.getSession(false), "HTTP session must be created");

        // 3. Current user check
        var currentUser = authService.getCurrentUser(request);
        assertNotNull(currentUser, "Session must identify authenticated user");
        assertEquals(profile.getId(), currentUser.getId());

        // 4. Logout -> session invalidated
        authService.logout(request, response);
        assertNull(authService.getCurrentUser(request), "Logged out session must reject authentication");
    }

    @Test
    @Order(4)
    @DisplayName("4. Password reset works with expiring, single-use tokens")
    public void test4_PasswordReset() {
        // 1. Request password reset
        com.itcareerpartner.auth.dto.ForgotPasswordRequest forgotReq = new com.itcareerpartner.auth.dto.ForgotPasswordRequest();
        forgotReq.setEmail(testEmail);
        authService.requestPasswordReset(forgotReq);

        // 2. Retrieve token from local email testing inbox
        List<OutboxEmailDto> emails = emailService.getRecentEmails();
        OutboxEmailDto resetEmail = emails.stream()
                .filter(e -> e.getRecipient().equalsIgnoreCase(testEmail) && "PASSWORD_RESET".equals(e.getPurpose()))
                .findFirst()
                .orElse(null);

        assertNotNull(resetEmail, "Password reset email must be present in local inbox");
        String resetToken = resetEmail.getToken();
        assertNotNull(resetToken);

        // 3. Reset password to new password
        String newPassword = "BrandNewPassword2026#";
        ResetPasswordRequest resetReq = new ResetPasswordRequest();
        resetReq.setToken(resetToken);
        resetReq.setNewPassword(newPassword);

        boolean resetSuccess = authService.resetPassword(resetReq);
        assertTrue(resetSuccess, "Password reset must return true");

        // 4. Verify repository has updated BCrypt hash
        User user = userRepository.findByNormalizedEmail(testEmail.toLowerCase()).orElseThrow();
        assertTrue(passwordEncoder.matches(newPassword, user.getPasswordHash()), "New password must match BCrypt hash");
        assertFalse(passwordEncoder.matches(testPassword, user.getPasswordHash()), "Old password must no longer match");

        // 5. Verify single-use token: Reusing token must fail
        assertThrows(IllegalArgumentException.class, () -> {
            authService.resetPassword(resetReq);
        }, "Reusing single-use reset token must be rejected");
    }

    @AfterAll
    public void cleanup() {
        userDb.clear();
        tokenDb.clear();
    }
}
