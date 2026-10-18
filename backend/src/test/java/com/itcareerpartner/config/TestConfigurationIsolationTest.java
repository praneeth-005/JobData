package com.itcareerpartner.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.io.InputStream;
import java.util.Properties;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Automated Test Isolation Guard.
 * Strictly verifies that test properties NEVER point to production, Atlas, or remote databases.
 */
public class TestConfigurationIsolationTest {

    @Test
    @DisplayName("Verify test profile properties enforce strict isolation from Atlas and production")
    void testIsolationProperties() throws Exception {
        Properties testProps = new Properties();
        try (InputStream is = getClass().getClassLoader().getResourceAsStream("application-test.properties")) {
            assertNotNull(is, "application-test.properties must exist on test classpath");
            testProps.load(is);
        }

        String activeProfile = testProps.getProperty("spring.profiles.active");
        assertEquals("test", activeProfile, "Active profile must be explicitly set to 'test'");

        String mongoUri = testProps.getProperty("spring.data.mongodb.uri");
        assertNotNull(mongoUri, "spring.data.mongodb.uri must be configured in test properties");

        // Strict assertions to prevent accidental connection to Atlas or production
        assertFalse(mongoUri.contains("mongodb+srv://"), "Test URI must NEVER use mongodb+srv protocol");
        assertFalse(mongoUri.contains("mongodb.net"), "Test URI must NEVER target cloud Atlas domains");
        assertFalse(mongoUri.contains("@"), "Test URI must NEVER contain embedded credentials");
        assertTrue(mongoUri.contains("127.0.0.1") || mongoUri.contains("localhost"),
                "Test URI must target isolated local loopback only");

        // Verify storage isolation: test resumes must write to target/ (temporary)
        String storageDir = testProps.getProperty("storage.resume.local-dir");
        assertNotNull(storageDir, "storage.resume.local-dir must be configured");
        assertTrue(storageDir.contains("target"), "Test storage directory must reside within target/ build directory");
    }

    @Test
    @DisplayName("Verify test classpath application.properties mirrors isolated test settings")
    void testClasspathApplicationProperties() throws Exception {
        Properties props = new Properties();
        try (InputStream is = getClass().getClassLoader().getResourceAsStream("application.properties")) {
            assertNotNull(is, "application.properties must exist on test classpath");
            props.load(is);
        }

        String mongoUri = props.getProperty("spring.data.mongodb.uri");
        assertNotNull(mongoUri);
        assertFalse(mongoUri.contains("mongodb.net"), "Classpath application.properties must NEVER target Atlas");
        assertFalse(mongoUri.contains("@"), "Classpath application.properties must NEVER contain credentials");
    }
}
