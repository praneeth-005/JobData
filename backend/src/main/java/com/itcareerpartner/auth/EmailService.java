package com.itcareerpartner.auth;

import com.itcareerpartner.auth.dto.OutboxEmailDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class EmailService {
    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    // Thread-safe in-memory mailbox for local email-testing setup
    private final List<OutboxEmailDto> localOutbox = new CopyOnWriteArrayList<>();

    public void sendVerificationEmail(String recipientEmail, String token) {
        String link = "http://localhost:8080/api/v1/auth/verify-email?token=" + token;
        String subject = "Verify your IT Career Partner Account";

        OutboxEmailDto email = new OutboxEmailDto(recipientEmail, subject, token, link, "EMAIL_VERIFICATION", Instant.now());
        localOutbox.add(0, email);

        log.info("==================================================================");
        log.info("[LOCAL EMAIL TESTING SETUP] Verification Email Dispatched!");
        log.info("To: {}", recipientEmail);
        log.info("Subject: {}", subject);
        log.info("Verification Token: {}", token);
        log.info("Verification Link: {}", link);
        log.info("==================================================================");
    }

    public void sendPasswordResetEmail(String recipientEmail, String token) {
        String link = "http://localhost:8080/api/v1/auth/reset-password?token=" + token;
        String subject = "Reset your IT Career Partner Password";

        OutboxEmailDto email = new OutboxEmailDto(recipientEmail, subject, token, link, "PASSWORD_RESET", Instant.now());
        localOutbox.add(0, email);

        log.info("==================================================================");
        log.info("[LOCAL EMAIL TESTING SETUP] Password Reset Email Dispatched!");
        log.info("To: {}", recipientEmail);
        log.info("Subject: {}", subject);
        log.info("Reset Token: {}", token);
        log.info("Reset Link: {}", link);
        log.info("Expires in: 15 minutes");
        log.info("==================================================================");
    }

    public List<OutboxEmailDto> getRecentEmails() {
        return Collections.unmodifiableList(new ArrayList<>(localOutbox));
    }

    public void clearOutbox() {
        localOutbox.clear();
    }
}
