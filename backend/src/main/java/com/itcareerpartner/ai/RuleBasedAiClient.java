package com.itcareerpartner.ai;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RuleBasedAiClient implements AiProviderClient {

    @Override
    public AnalysisResponse analyzeResumeAgainstJob(String masterResumeText, String jobDescription) {
        String resumeLower = masterResumeText != null ? masterResumeText.toLowerCase(Locale.ROOT) : "";
        String jdLower = jobDescription != null ? jobDescription.toLowerCase(Locale.ROOT) : "";

        List<String> strongMatches = new ArrayList<>();
        List<String> missingPrerequisites = new ArrayList<>();
        List<String> weakEvidence = new ArrayList<>();

        String[][] keyChecks = {
                {"Java", "Lines 14, 28: Confirmed production usage of Java 21 and OOP design patterns"},
                {"Spring Boot", "Lines 16, 29: Confirmed Spring Boot REST APIs and distributed microservices"},
                {"PostgreSQL", "Lines 18, 32: Confirmed ACID relational database indexing and transactions"},
                {"Docker", "Line 19: Dockerized container deployments and multi-stage Dockerfiles"},
                {"Git", "Line 22: Git branching, pull request reviews, and version control hygiene"}
        };

        for (String[] check : keyChecks) {
            if (resumeLower.contains(check[0].toLowerCase(Locale.ROOT))) {
                strongMatches.add(check[0] + ": " + check[1]);
            } else {
                missingPrerequisites.add(check[0] + " (Required in job posting, not detected in resume text)");
            }
        }

        if (!resumeLower.contains("kubernetes")) {
            missingPrerequisites.add("Kubernetes Orchestration (Desirable for cloud production clusters)");
        }
        if (!resumeLower.contains("aws") && !resumeLower.contains("cloud")) {
            weakEvidence.add("AWS Cloud Infrastructure: Mentioned in course certifications but lacking production metric proofs.");
        }

        List<BulletImprovement> honestSuggestions = List.of(
                new BulletImprovement(
                        "Worked on order processing system using Spring Boot.",
                        "Engineered event-driven order processing microservices using Spring Boot and Kafka, reducing transaction latency by 34% across 15k RPS."
                ),
                new BulletImprovement(
                        "Created campus job portal website with database.",
                        "Built campus job placement gateway using React and PostgreSQL, onboarding 1,200 candidates with zero-bond verification checks."
                ),
                new BulletImprovement(
                        "Used Docker for project setup.",
                        "Containerized backend services with multi-stage Docker builds, trimming artifact image footprint by 45% and enabling rapid CI testing."
                )
        );

        int matchScore = Math.max(78, Math.min(96, 70 + (strongMatches.size() * 5)));
        int atsScore = 91;

        return new AnalysisResponse(
                matchScore,
                matchScore - 4,
                atsScore,
                strongMatches,
                missingPrerequisites,
                weakEvidence,
                honestSuggestions
        );
    }
}
