package com.itcareerpartner.tracker.dto;

import com.itcareerpartner.tracker.ActivityItem;
import com.itcareerpartner.tracker.ApplicationStage;
import com.itcareerpartner.tracker.JobApplication;
import com.itcareerpartner.tracker.SavedJobItem;

import java.util.List;

public class TrackerDtos {

    public record KanbanColumn(
            ApplicationStage stage,
            String title,
            String colorBadge,
            int count,
            List<JobApplication> applications
    ) {}

    public record KanbanBoardResponse(
            int totalTrackedCount,
            int inProgressCount,
            int interviewsScheduledCount,
            int offersCount,
            List<KanbanColumn> columns
    ) {}

    public record CreateApplicationRequest(
            String jobId,
            String company,
            String title,
            String logoText,
            String ctcText,
            Double ctcLpa,
            String location,
            String workMode,
            String batchAllowed,
            ApplicationStage stage,
            String resumeVersionId,
            String resumeVersionLabel,
            String portalUrl,
            String recruiterContact,
            String notes
    ) {}

    public record UpdateApplicationRequest(
            String company,
            String title,
            String ctcText,
            Double ctcLpa,
            String location,
            String workMode,
            ApplicationStage stage,
            String statusLabel,
            String nextActionTitle,
            String nextActionFormatted,
            String recruiterContact,
            String notes
    ) {}

    public record SavedJobsResponse(
            int totalSavedCount,
            int verifiedEligibleCount,
            int needsReviewCount,
            int closedCount,
            List<SavedJobItem> savedJobs
    ) {}

    public record ScheduleHubResponse(
            int totalUpcomingCount,
            int interviewsCount,
            int assessmentsCount,
            int followupsDueCount,
            int overdueCount,
            List<ActivityItem> activities
    ) {}
}
