package com.itcareerpartner;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedHashMap;
import java.util.Map;

@SpringBootApplication
@EnableScheduling
@EnableAsync
public class ItCareerPartnerApplication {

    private static final Logger log = LoggerFactory.getLogger(ItCareerPartnerApplication.class);

    public static void main(String[] args) {
        // Enforce TLSv1.2 and standard curves for Java 26 compatibility with MongoDB Atlas SSL
        System.setProperty("jdk.tls.client.protocols", "TLSv1.2");
        System.setProperty("jdk.tls.namedGroups", "x25519,secp256r1,secp384r1");

        // Load local .env configuration if present (safe, ignored local file)
        loadLocalEnvIfPresent();

        SpringApplication.run(ItCareerPartnerApplication.class, args);
    }

    /**
     * Minimal, zero-dependency helper to load local environment configuration from .env.
     * Checks current working directory and parent directory.
     * Handles Windows UTF-8 BOM, CRLF, duplicate keys, and quoted values.
     * Never overrides existing System properties or OS environment variables.
     * Never logs property values or secrets.
     */
    public static void loadLocalEnvIfPresent() {
        Path[] candidatePaths = {
            Path.of(".env"),
            Path.of("../.env")
        };

        for (Path path : candidatePaths) {
            if (Files.isRegularFile(path)) {
                try (BufferedReader reader = Files.newBufferedReader(path, StandardCharsets.UTF_8)) {
                    String line;
                    Map<String, String> envMap = new LinkedHashMap<>();
                    while ((line = reader.readLine()) != null) {
                        line = line.trim();
                        if (line.isEmpty() || line.startsWith("#") || !line.contains("=")) {
                            continue;
                        }
                        int eqIdx = line.indexOf('=');
                        String key = line.substring(0, eqIdx).trim();
                        String val = line.substring(eqIdx + 1).trim();

                        // Strip potential UTF-8 BOM from Windows editors (e.g. Notepad)
                        if (key.startsWith("\uFEFF")) {
                            key = key.substring(1).trim();
                        }

                        // Strip matching surrounding quotes (" or ')
                        if ((val.startsWith("\"") && val.endsWith("\"") && val.length() >= 2) ||
                            (val.startsWith("'") && val.endsWith("'") && val.length() >= 2)) {
                            val = val.substring(1, val.length() - 1);
                        }

                        if (!key.isEmpty()) {
                            envMap.put(key, val);
                        }
                    }

                    int count = 0;
                    for (Map.Entry<String, String> entry : envMap.entrySet()) {
                        String k = entry.getKey();
                        String v = entry.getValue();
                        // Real OS environment variables and JVM system properties always take precedence
                        if (System.getProperty(k) == null && System.getenv(k) == null) {
                            System.setProperty(k, v);
                            count++;
                        }
                    }
                    log.info("Loaded {} configuration property(ies) from local file: {}", count, path.toAbsolutePath().normalize());
                    break;
                } catch (IOException e) {
                    log.warn("Could not read local environment file: {}", path);
                }
            }
        }
    }
}
