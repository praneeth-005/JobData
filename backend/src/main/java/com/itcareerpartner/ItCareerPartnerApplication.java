package com.itcareerpartner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableAsync
public class ItCareerPartnerApplication {
    public static void main(String[] args) {
        // Enforce TLSv1.2 and standard curves for Java 26 compatibility with MongoDB Atlas SSL
        System.setProperty("jdk.tls.client.protocols", "TLSv1.2");
        System.setProperty("jdk.tls.namedGroups", "x25519,secp256r1,secp384r1");
        SpringApplication.run(ItCareerPartnerApplication.class, args);
    }
}
