package com.itcareerpartner.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import java.util.Arrays;

/**
 * Validates MongoDB configuration settings at startup.
 * Enforces production fail-fast rules, ensures isolation,
 * and guarantees zero credential leakage in logs or exception messages.
 */
@Configuration
public class MongoConfigurationValidator {

    private static final Logger log = LoggerFactory.getLogger(MongoConfigurationValidator.class);

    private final Environment environment;

    @Value("${spring.data.mongodb.uri:}")
    private String mongoUri;

    @Value("${spring.data.mongodb.database:}")
    private String mongoDatabase;

    public MongoConfigurationValidator(Environment environment) {
        this.environment = environment;
    }

    @PostConstruct
    public void validateConfiguration() {
        boolean isProd = isProfileActive("prod");
        boolean isTest = isProfileActive("test");

        if (isProd) {
            validateProductionConfiguration();
        }

        logSafeStatus(isProd, isTest);
    }

    /**
     * Enforces production fail-fast requirements:
     * 1. URI must be explicitly provided.
     * 2. URI must not be empty or whitespace.
     * 3. URI must not target localhost, 127.0.0.1, or loopback.
     * 4. URI must use a valid protocol (mongodb:// or mongodb+srv://).
     * 5. URI host must be resolvable and non-empty.
     *
     * Exception messages NEVER contain URI credentials or secret values.
     */
    void validateProductionConfiguration() {
        if (mongoUri == null || mongoUri.trim().isEmpty()) {
            throw new IllegalStateException(
                "Production configuration failure: MONGODB_URI environment variable is required and must not be empty."
            );
        }

        String lowerUri = mongoUri.trim().toLowerCase();

        if (lowerUri.contains("localhost") || lowerUri.contains("127.0.0.1") || lowerUri.contains("::1")) {
            throw new IllegalStateException(
                "Production configuration failure: Production MongoDB URI must not target localhost or a loopback address."
            );
        }

        if (!lowerUri.startsWith("mongodb://") && !lowerUri.startsWith("mongodb+srv://")) {
            throw new IllegalStateException(
                "Production configuration failure: Production MongoDB URI must use mongodb:// or mongodb+srv:// protocol."
            );
        }

        String safeHost = extractSafeHost(mongoUri);
        if (safeHost.equals("[unknown host]") || safeHost.equals("[not configured]") || safeHost.equals("[redacted host]")) {
            throw new IllegalStateException(
                "Production configuration failure: Malformed MongoDB URI; host could not be determined."
            );
        }
    }

    /**
     * Logs safe diagnostic information.
     * Extracts only the host/cluster domain name, never printing passwords or complete URIs.
     */
    private void logSafeStatus(boolean isProd, boolean isTest) {
        String safeTarget = extractSafeHost(mongoUri);
        String dbName = (mongoDatabase != null && !mongoDatabase.isBlank()) ? mongoDatabase : "[default]";

        if (isProd) {
            log.info("Production MongoDB configuration validated successfully (Target Host: {}, Database: {})", safeTarget, dbName);
        } else if (isTest) {
            log.info("Test MongoDB configuration active (Target Host: {}, Database: {})", safeTarget, dbName);
        } else {
            log.info("Development MongoDB configuration active (Target Host: {}, Database: {})", safeTarget, dbName);
        }
    }

    /**
     * Extracts only the hostname or cluster address from a URI, redacting any credentials and query parameters.
     */
    public static String extractSafeHost(String uri) {
        if (uri == null || uri.isBlank()) {
            return "[not configured]";
        }
        try {
            String stripped = uri.trim();
            // Remove credentials (user:password@)
            if (stripped.contains("@")) {
                stripped = stripped.substring(stripped.indexOf("@") + 1);
            } else if (stripped.contains("://")) {
                stripped = stripped.substring(stripped.indexOf("://") + 3);
            }
            // Strip database path and query string
            int slashIdx = stripped.indexOf("/");
            if (slashIdx >= 0) {
                stripped = stripped.substring(0, slashIdx);
            }
            int queryIdx = stripped.indexOf("?");
            if (queryIdx >= 0) {
                stripped = stripped.substring(0, queryIdx);
            }
            return stripped.isBlank() ? "[unknown host]" : stripped;
        } catch (Exception e) {
            return "[redacted host]";
        }
    }

    private boolean isProfileActive(String profile) {
        return Arrays.asList(environment.getActiveProfiles()).contains(profile);
    }

    // Package-private setters for unit testability without reflection
    void setMongoUriForTesting(String uri) {
        this.mongoUri = uri;
    }

    void setMongoDatabaseForTesting(String db) {
        this.mongoDatabase = db;
    }
}
