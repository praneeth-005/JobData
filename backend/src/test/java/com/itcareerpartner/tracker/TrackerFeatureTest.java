package com.itcareerpartner.tracker;

import com.itcareerpartner.tracker.dto.TrackerDtos.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class TrackerFeatureTest {

    private JobApplicationRepository applicationRepository;
    private SavedJobRepository savedJobRepository;
    private ActivityRepository activityRepository;
    private TrackerService trackerService;

    @BeforeEach
    void setUp() {
        applicationRepository = Mockito.mock(JobApplicationRepository.class);
        savedJobRepository = Mockito.mock(SavedJobRepository.class);
        activityRepository = Mockito.mock(ActivityRepository.class);

        // Allow repo saves to pass through without throwing
        when(applicationRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(savedJobRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(activityRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        trackerService = new TrackerService(applicationRepository, savedJobRepository, activityRepository);
    }

    @Test
    @DisplayName("Verify Kanban board returns pre-seeded applications with 2026 Batch support")
    void testGetKanbanBoard() {
        KanbanBoardResponse kanban = trackerService.getKanbanBoard("user_arjun");
        assertNotNull(kanban);
        assertTrue(kanban.totalTrackedCount() >= 5, "Should have seeded at least 5 default pursuits");
        assertNotNull(kanban.columns());
        assertEquals(5, kanban.columns().size(), "Should have 5 kanban columns");

        // Verify all seeded applications are explicitly 2026 Batch eligible
        List<JobApplication> all = trackerService.getAllApplications("user_arjun");
        for (JobApplication app : all) {
            assertTrue(app.getBatchAllowed().contains("2026"), "All tracker jobs must explicitly include 2026 batch: " + app.getCompany());
        }
    }

    @Test
    @DisplayName("Verify creating application creates initial timeline and updates kanban")
    void testCreateApplication() {
        CreateApplicationRequest req = new CreateApplicationRequest(
                "job_google_swe",
                "Google India",
                "Software Engineer - University Graduate",
                "GO",
                "₹24.0 - ₹32.0 LPA",
                28.0,
                "Bengaluru",
                "Hybrid",
                "2026 Batch",
                ApplicationStage.APPLIED,
                "res_v21",
                "v2.1",
                "https://careers.google.com",
                "priya.tech@google.com",
                "Referred by senior software engineer"
        );

        JobApplication created = trackerService.createApplication(req, "user_arjun");
        assertNotNull(created);
        assertNotNull(created.getId());
        assertEquals("Google India", created.getCompany());
        assertEquals(ApplicationStage.APPLIED, created.getStage());
        assertEquals(2, created.getTimeline().size(), "Should initialize initial submission and screening timeline milestones");

        JobApplication fetched = trackerService.getApplicationById(created.getId());
        assertEquals("Google India", fetched.getCompany());
    }

    @Test
    @DisplayName("Verify updating application stage modifies status label and timeline")
    void testUpdateApplication() {
        JobApplication initial = trackerService.getAllApplications("user_arjun").get(0);
        String appId = initial.getId();

        UpdateApplicationRequest updateReq = new UpdateApplicationRequest(
                null,
                null,
                null,
                null,
                null,
                null,
                ApplicationStage.TECHNICAL_INTERVIEW,
                "Round 2 Scheduled",
                "Prepare System Design & Concurrency",
                "Tomorrow at 11:00 AM",
                "recruiter@enterprise.com",
                "Technical prep complete"
        );

        JobApplication updated = trackerService.updateApplication(appId, updateReq);
        assertEquals(ApplicationStage.TECHNICAL_INTERVIEW, updated.getStage());
        assertEquals("Round 2 Scheduled", updated.getStatusLabel());
        assertEquals("Prepare System Design & Concurrency", updated.getNextActionTitle());
    }

    @Test
    @DisplayName("Verify Saved Jobs management (listing, saving new, and unsaving)")
    void testSavedJobsOperations() {
        SavedJobsResponse initial = trackerService.getSavedJobs("user_arjun");
        assertNotNull(initial);
        int initialCount = initial.totalSavedCount();
        assertTrue(initialCount >= 5);

        // Save a new job
        SavedJobItem newJob = new SavedJobItem();
        newJob.setJobId("job_microsoft_sde");
        newJob.setCompany("Microsoft");
        newJob.setTitle("Software Engineer 1");
        newJob.setBatchAllowed("2026 Batch");
        newJob.setCtcText("₹22.0 - ₹26.0 LPA");
        newJob.setLocation("Hyderabad");
        newJob.setVerificationStatus("VERIFIED_ELIGIBLE");
        newJob.setTags(List.of("Distributed Systems", "C#", "Azure"));

        SavedJobItem saved = trackerService.saveJob(newJob, "user_arjun");
        assertNotNull(saved.getId());

        SavedJobsResponse afterSave = trackerService.getSavedJobs("user_arjun");
        assertEquals(initialCount + 1, afterSave.totalSavedCount());

        // Unsave
        trackerService.unsaveJob(newJob.getJobId(), "user_arjun");
        SavedJobsResponse afterUnsave = trackerService.getSavedJobs("user_arjun");
        assertEquals(initialCount, afterUnsave.totalSavedCount());
    }

    @Test
    @DisplayName("Verify Schedule Hub and Activity status transition")
    void testScheduleHub() {
        ScheduleHubResponse hub = trackerService.getScheduleHub("user_arjun");
        assertNotNull(hub);
        assertTrue(hub.totalUpcomingCount() >= 5);
        assertTrue(hub.interviewsCount() > 0);

        ActivityItem first = hub.activities().get(0);
        ActivityItem updated = trackerService.updateActivityStatus(first.getId(), "COMPLETED");
        assertNotNull(updated);
        assertEquals("COMPLETED", updated.getStatus());
    }
}
