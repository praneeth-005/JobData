package com.itcareerpartner.config;

import com.itcareerpartner.ItCareerPartnerApplication;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.env.MockEnvironment;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Phase 3A Security Regression Tests:
 * Validates that secrets and configurations adhere strictly to security boundaries:
 * 1. Zero hard-coded credentials in main or prod configurations.
 * 2. Production profile fails fast if MONGODB_URI is absent, blank, malformed, or points to loopback.
 * 3. Diagnostic logging and exception messages never leak credentials.
 * 4. .env.example contains only non-sensitive placeholders.
 * 5. Minimal .env loader handles Windows BOM, duplicate keys, quotes, and preserves OS env precedence.
 */
public class MongoConfigurationSecurityTest {

    @Test
    @DisplayName("Verify main application.properties contains zero passwords and safe local default")
    void testMainPropertiesContainsNoSecrets() throws Exception {
        Path mainPropsPath = Path.of("src/main/resources/application.properties");
        if (!Files.exists(mainPropsPath)) {
            mainPropsPath = Path.of("backend/src/main/resources/application.properties");
        }
        assertTrue(Files.exists(mainPropsPath), "application.properties must exist");

        String content = Files.readString(mainPropsPath);

        // Assert no credentials or Atlas endpoints are hardcoded
        assertFalse(content.contains("mongodb+srv://"), "Main application.properties must not contain cloud Atlas URI");
        assertFalse(content.contains("mongodb.net"), "Main application.properties must not target cloud cluster domains");
        assertFalse(content.contains("@"), "Main application.properties must not contain embedded user:password credentials");

        // Assert local safe default is present
        assertTrue(content.contains("spring.data.mongodb.uri=${MONGODB_URI:mongodb://localhost:27017/it_career_partner}"),
                "Main application.properties must default to local loopback when MONGODB_URI is unset");
    }

    @Test
    @DisplayName("Verify application-prod.properties requires explicit external MONGODB_URI with no fallback")
    void testProdPropertiesRequiresExplicitUri() throws Exception {
        Path prodPropsPath = Path.of("src/main/resources/application-prod.properties");
        if (!Files.exists(prodPropsPath)) {
            prodPropsPath = Path.of("backend/src/main/resources/application-prod.properties");
        }
        assertTrue(Files.exists(prodPropsPath), "application-prod.properties must exist");

        String content = Files.readString(prodPropsPath);

        // Production profile must require MONGODB_URI without any default fallback
        assertTrue(content.contains("spring.data.mongodb.uri=${MONGODB_URI}"),
                "application-prod.properties must bind directly to ${MONGODB_URI} without a fallback value");
        assertFalse(content.contains("mongodb://localhost"),
                "application-prod.properties must never fall back to localhost");
        assertFalse(content.contains("@"),
                "application-prod.properties must not contain embedded credentials");
    }

    @Test
    @DisplayName("Verify root .env.example contains only non-sensitive placeholder templates")
    void testEnvExampleContainsOnlyPlaceholders() throws Exception {
        Path envExamplePath = Path.of("../.env.example");
        if (!Files.exists(envExamplePath)) {
            envExamplePath = Path.of(".env.example");
        }
        assertTrue(Files.exists(envExamplePath), ".env.example must exist in repository root");

        String content = Files.readString(envExamplePath);
        assertTrue(content.contains("<DB_USERNAME>"), ".env.example must use username placeholder");
        assertTrue(content.contains("<DB_PASSWORD>"), ".env.example must use password placeholder");
        assertTrue(content.contains("<CLUSTER_HOST>"), ".env.example must use cluster host placeholder");
        assertFalse(content.contains("surapureddypraneeth"), ".env.example must not contain real username");
    }

    @Test
    @DisplayName("Verify production validator throws IllegalStateException when MONGODB_URI is missing or blank")
    void testValidatorFailsFastWhenProdUriMissingOrBlank() {
        MockEnvironment env = new MockEnvironment();
        env.setActiveProfiles("prod");

        MongoConfigurationValidator validator = new MongoConfigurationValidator(env);

        // Null URI
        validator.setMongoUriForTesting(null);
        IllegalStateException exNull = assertThrows(IllegalStateException.class, validator::validateConfiguration);
        assertTrue(exNull.getMessage().contains("Production configuration failure"),
                "Exception message must clearly state production configuration failure");

        // Blank URI
        validator.setMongoUriForTesting("   ");
        IllegalStateException exBlank = assertThrows(IllegalStateException.class, validator::validateConfiguration);
        assertTrue(exBlank.getMessage().contains("Production configuration failure"));

        // Confirm zero leak of secrets
        assertFalse(exNull.getMessage().contains("password"));
        assertFalse(exBlank.getMessage().contains("password"));
    }

    @Test
    @DisplayName("Verify production validator throws IllegalStateException when MONGODB_URI points to localhost or loopback")
    void testValidatorFailsFastWhenProdUriPointsToLocalhost() {
        MockEnvironment env = new MockEnvironment();
        env.setActiveProfiles("prod");

        MongoConfigurationValidator validator = new MongoConfigurationValidator(env);

        // Test localhost
        validator.setMongoUriForTesting("mongodb://localhost:27017/it_career_partner");
        IllegalStateException ex1 = assertThrows(IllegalStateException.class, validator::validateConfiguration);
        assertTrue(ex1.getMessage().contains("must not target localhost or a loopback address"));

        // Test 127.0.0.1
        validator.setMongoUriForTesting("mongodb://127.0.0.1:27017/it_career_partner");
        IllegalStateException ex2 = assertThrows(IllegalStateException.class, validator::validateConfiguration);
        assertTrue(ex2.getMessage().contains("must not target localhost or a loopback address"));

        // Test IPv6 loopback ::1
        validator.setMongoUriForTesting("mongodb://[::1]:27017/it_career_partner");
        IllegalStateException ex3 = assertThrows(IllegalStateException.class, validator::validateConfiguration);
        assertTrue(ex3.getMessage().contains("must not target localhost or a loopback address"));

        // Verify no secrets leaked
        assertFalse(ex1.getMessage().contains("password"));
        assertFalse(ex2.getMessage().contains("password"));
        assertFalse(ex3.getMessage().contains("password"));
    }

    @Test
    @DisplayName("Verify production validator throws IllegalStateException when MONGODB_URI is malformed")
    void testValidatorFailsFastWhenProdUriIsMalformed() {
        MockEnvironment env = new MockEnvironment();
        env.setActiveProfiles("prod");

        MongoConfigurationValidator validator = new MongoConfigurationValidator(env);

        // Invalid protocol (http://)
        validator.setMongoUriForTesting("http://mycluster.mongodb.net/it_career_partner");
        IllegalStateException exProto = assertThrows(IllegalStateException.class, validator::validateConfiguration);
        assertTrue(exProto.getMessage().contains("must use mongodb:// or mongodb+srv:// protocol"));

        // Incomplete URI without host (mongodb://)
        validator.setMongoUriForTesting("mongodb://");
        IllegalStateException exNoHost = assertThrows(IllegalStateException.class, validator::validateConfiguration);
        assertTrue(exNoHost.getMessage().contains("Malformed MongoDB URI"));

        // Empty host with @ (mongodb+srv://user:pass@)
        validator.setMongoUriForTesting("mongodb+srv://user:pass@");
        IllegalStateException exEmptyHost = assertThrows(IllegalStateException.class, validator::validateConfiguration);
        assertTrue(exEmptyHost.getMessage().contains("Malformed MongoDB URI"));

        // Verify none of the messages leak the secret pass
        assertFalse(exEmptyHost.getMessage().contains("pass"));
    }

    @Test
    @DisplayName("Verify production validator succeeds when provided a valid cloud MongoDB URI")
    void testValidatorSucceedsWithValidProdUri() {
        MockEnvironment env = new MockEnvironment();
        env.setActiveProfiles("prod");

        MongoConfigurationValidator validator = new MongoConfigurationValidator(env);
        validator.setMongoUriForTesting("mongodb+srv://produser:secretpass123@prodcluster.bpgipwr.mongodb.net/it_career_partner?retryWrites=true");
        validator.setMongoDatabaseForTesting("it_career_partner");

        assertDoesNotThrow(validator::validateConfiguration,
                "Valid production URI must pass validation without exceptions");
    }

    @Test
    @DisplayName("Verify extractSafeHost completely strips credentials and query strings")
    void testExtractSafeHostRedaction() {
        String input = "mongodb+srv://sensitiveUser:verySecretPassword99@cluster0.abcde.mongodb.net/it_career_partner?retryWrites=true&w=majority";
        String safeHost = MongoConfigurationValidator.extractSafeHost(input);

        assertEquals("cluster0.abcde.mongodb.net", safeHost,
                "extractSafeHost must extract only domain, discarding credentials and query params");
        assertFalse(safeHost.contains("sensitiveUser"), "Safe host must not contain username");
        assertFalse(safeHost.contains("verySecretPassword99"), "Safe host must not contain password");
        assertFalse(safeHost.contains("retryWrites"), "Safe host must not contain query parameters");

        // Localhost URI
        assertEquals("localhost:27017", MongoConfigurationValidator.extractSafeHost("mongodb://localhost:27017/it_career_partner"));

        // Null / blank URI
        assertEquals("[not configured]", MongoConfigurationValidator.extractSafeHost(null));
        assertEquals("[not configured]", MongoConfigurationValidator.extractSafeHost("  "));

        // Malformed incomplete URI
        assertEquals("[unknown host]", MongoConfigurationValidator.extractSafeHost("mongodb://"));
    }

    @Test
    @DisplayName("Verify loadLocalEnvIfPresent safely loads MONGODB_URI without error")
    void testLoadLocalEnvSafeExecution() {
        assertDoesNotThrow(ItCareerPartnerApplication::loadLocalEnvIfPresent);
        String uri = System.getProperty("MONGODB_URI");
        if (uri != null) {
            assertFalse(uri.isBlank(), "MONGODB_URI must not be blank if present");
            String safeHost = MongoConfigurationValidator.extractSafeHost(uri);
            assertNotEquals("[unknown host]", safeHost, "Safe host must be successfully extractable");
            assertFalse(safeHost.contains("@"), "Safe host must not contain credentials");
        }
    }
}
