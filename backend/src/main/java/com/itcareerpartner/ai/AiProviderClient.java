package com.itcareerpartner.ai;

/**
 * Provider-Independent AI Interface for Resume Analysis and Job Matching.
 * Decouples domain logic from specific LLM providers (OpenAI, Claude, Gemini, Ollama).
 */
public interface AiProviderClient {
    AnalysisResponse analyzeResumeAgainstJob(String masterResumeText, String jobDescription);

    record AnalysisResponse(
            int jobMatchScore,
            int resumeMatchScore,
            int atsScore,
            java.util.List<String> strongMatches,
            java.util.List<String> missingPrerequisites,
            java.util.List<String> weakEvidence,
            java.util.List<BulletImprovement> honestSuggestions
    ) {}

    record BulletImprovement(String original, String recommended) {}
}
