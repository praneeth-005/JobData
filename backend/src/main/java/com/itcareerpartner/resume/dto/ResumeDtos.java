package com.itcareerpartner.resume.dto;

import com.itcareerpartner.resume.*;
import java.time.Instant;
import java.util.List;

public class ResumeDtos {

    public record ResumeUploadResponse(
            String id,
            String versionLabel,
            String fileName,
            long fileSizeBytes,
            String sha256Hash,
            int atsScore,
            int overallScore,
            String status,
            List<String> extractedSkills,
            String message
    ) {}

    public record ResumeOverview(
            ResumeVersion resume,
            int totalSkillsCount,
            int totalProjectsCount,
            int matchingJobsCount,
            int peakMatchPercent,
            String topMatchingCompany,
            List<String> topSkills,
            List<ResumeProjectItem> projects,
            int atsScore,
            int overallQualityScore
    ) {}

    public record JobMatchItem(
            String jobId,
            String company,
            String title,
            String logoText,
            String ctcText,
            String workMode,
            int matchScore,
            int resumeScore,
            String tag,
            List<EvidenceItem> confirmedEvidence,
            List<String> missingPrerequisites,
            List<String> weakEvidence,
            List<MatchFactorItem> matchFactors
    ) {}

    public record MultiJobMatchResponse(
            String resumeVersionId,
            String resumeLabel,
            int totalOpportunitiesEvaluated,
            String activeTargetJobId,
            List<JobMatchItem> evaluatedJobs
    ) {}

    public record ImprovementsResponse(
            String resumeVersionId,
            String resumeLabel,
            int totalSuggestions,
            int highPriorityCount,
            int mediumPriorityCount,
            int formatStyleCount,
            List<BulletImprovementItem> suggestions
    ) {}

    public record VersionDiffResponse(
            ResumeVersion fromVersion,
            ResumeVersion toVersion,
            int atsScoreDelta,
            int skillCountDelta,
            List<String> addedSkills,
            List<String> removedWeakPhrases,
            String summary
    ) {}
}
