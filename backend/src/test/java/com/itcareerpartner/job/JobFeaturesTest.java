package com.itcareerpartner.job;

import com.itcareerpartner.job.dto.AddJobSourceRequest;
import com.itcareerpartner.job.dto.FoundJobSummaryDto;
import com.itcareerpartner.job.dto.JobSourceSummaryDto;
import com.itcareerpartner.job.dto.StartScanRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class JobFeaturesTest {

    private JobSourceRepository jobSourceRepository;
    private DiscoveryScanRepository scanRepository;
    private FoundJobRepository foundJobRepository;

    private JobSourceService jobSourceService;
    private JobDiscoveryService discoveryService;
    private FoundJobService foundJobService;

    @BeforeEach
    void setUp() {
        jobSourceRepository = Mockito.mock(JobSourceRepository.class);
        scanRepository = Mockito.mock(DiscoveryScanRepository.class);
        foundJobRepository = Mockito.mock(FoundJobRepository.class);

        jobSourceService = new JobSourceService(jobSourceRepository);
        discoveryService = new JobDiscoveryService(scanRepository, jobSourceRepository);
        foundJobService = new FoundJobService(foundJobRepository);
    }

    @Test
    @DisplayName("JobSourceService: Add new job source and derive monogram logo")
    void testAddJobSource() {
        AddJobSourceRequest req = new AddJobSourceRequest(
                "Freshworks",
                "Freshworks Global Careers",
                "https://careers.freshworks.com",
                "Official Career Portal"
        );

        when(jobSourceRepository.save(any(JobSource.class))).thenAnswer(invocation -> invocation.getArgument(0));

        JobSource saved = jobSourceService.addJobSource(req);
        assertNotNull(saved);
        assertEquals("Freshworks", saved.getCompanyName());
        assertEquals("https://careers.freshworks.com", saved.getPortalUrl());
        assertEquals("FR", saved.getLogoText());
        assertEquals("ACTIVE", saved.getStatus());
        assertEquals("PORTAL", saved.getSourceType());
    }

    @Test
    @DisplayName("JobSourceService: Filter sources by query and type")
    void testFilterJobSources() {
        List<JobSource> mockList = new ArrayList<>();
        JobSource s1 = new JobSource("Thoughtworks", "Thoughtworks Careers", "https://thoughtworks.com", "PORTAL", "TW", 18);
        s1.setStatus("ACTIVE");
        JobSource s2 = new JobSource("Swiggy", "Swiggy Tech Careers", "https://swiggy.com", "API", "SW", 6);
        s2.setStatus("ACTIVE");
        mockList.add(s1);
        mockList.add(s2);

        when(jobSourceRepository.findAllByOrderByCreatedAtDesc()).thenReturn(mockList);

        JobSourceSummaryDto summaryAll = jobSourceService.getJobSourcesSummary(null, "ALL", "ALL");
        assertEquals(2, summaryAll.getSources().size());
        assertEquals(24, summaryAll.getOpenOpportunities());

        JobSourceSummaryDto summaryApi = jobSourceService.getJobSourcesSummary(null, "API", "ALL");
        assertEquals(1, summaryApi.getSources().size());
        assertEquals("Swiggy", summaryApi.getSources().get(0).getCompanyName());

        JobSourceSummaryDto summaryQuery = jobSourceService.getJobSourcesSummary("Thought", "ALL", "ALL");
        assertEquals(1, summaryQuery.getSources().size());
        assertEquals("Thoughtworks", summaryQuery.getSources().get(0).getCompanyName());
    }

    @Test
    @DisplayName("JobDiscoveryService: Start full and single scope discovery scans")
    void testStartDiscoveryScan() {
        when(scanRepository.save(any(DiscoveryScan.class))).thenAnswer(invocation -> invocation.getArgument(0));

        StartScanRequest allReq = new StartScanRequest("ALL", null, null);
        DiscoveryScan allScan = discoveryService.startScan("user-1", allReq);
        assertEquals("ALL", allScan.getScope());
        assertEquals(72, allScan.getPostingsScanned());
        assertEquals(34, allScan.getFresherJobsFound());
        assertEquals("IN_PROGRESS", allScan.getStatus());

        StartScanRequest singleReq = new StartScanRequest("SINGLE", "Thoughtworks", "tw-1");
        DiscoveryScan singleScan = discoveryService.startScan("user-1", singleReq);
        assertEquals("SINGLE", singleScan.getScope());
        assertEquals("Thoughtworks", singleScan.getTargetCompanyName());
        assertEquals(18, singleScan.getPostingsScanned());
    }

    @Test
    @DisplayName("FoundJobService: Toggle save status and tab filtering")
    void testFoundJobOperations() {
        FoundJob job = new FoundJob(
                "Graduate Software Engineer",
                "Thoughtworks",
                "Bengaluru • Hybrid",
                "Bengaluru",
                "₹8.5 LPA",
                8.5,
                "FULL_TIME",
                "Verified Fresher",
                "VERIFIED",
                "10m ago",
                "Thoughtworks Careers",
                "https://thoughtworks.com",
                "TW",
                null
        );
        job.setId("job-tw");
        job.setSaved(false);

        when(foundJobRepository.findById("job-tw")).thenReturn(Optional.of(job));
        when(foundJobRepository.save(any(FoundJob.class))).thenAnswer(invocation -> invocation.getArgument(0));

        FoundJob toggled = foundJobService.toggleSaveJob("job-tw");
        assertTrue(toggled.isSaved());

        FoundJob toggledAgain = foundJobService.toggleSaveJob("job-tw");
        assertFalse(toggledAgain.isSaved());
    }

    @Test
    @DisplayName("FoundJobService: Tab counts and location filtering")
    void testFoundJobFiltering() {
        List<FoundJob> jobs = new ArrayList<>();
        FoundJob j1 = new FoundJob("SWE Fresher", "Thoughtworks", "Bengaluru", "Bengaluru", "₹8.5L", 8.5, "FULL_TIME", "Verified Fresher", "VERIFIED", "10m ago", "TW Careers", "https://tw.com", "TW", null);
        FoundJob j2 = new FoundJob("Frontend Trainee", "TechM", "Hyderabad", "Hyderabad", "₹3.6L", 3.6, "TRAINEE", "Review Details", "REVIEW", "1h ago", "Campus", "https://techm.com", "TM", "Notice");
        FoundJob j3 = new FoundJob("Senior Architect", "Infosys", "Bengaluru", "Bengaluru", "₹20L", 20.0, "FULL_TIME", "Excluded", "FILTERED", "2h ago", "Portal", "https://inf.com", "INF", null);
        jobs.add(j1);
        jobs.add(j2);
        jobs.add(j3);

        when(foundJobRepository.findAllByOrderByCreatedAtDesc()).thenReturn(jobs);

        FoundJobSummaryDto verifiedOnly = foundJobService.getFoundJobsSummary("VERIFIED", null, null);
        assertEquals(2, verifiedOnly.getAllCount());
        assertEquals(1, verifiedOnly.getVerifiedCount());
        assertEquals(1, verifiedOnly.getReviewCount());
        assertEquals(1, verifiedOnly.getFilteredCount());
        assertEquals(1, verifiedOnly.getJobs().size());
        assertEquals("Thoughtworks", verifiedOnly.getJobs().get(0).getCompany());

        FoundJobSummaryDto hyderabadSearch = foundJobService.getFoundJobsSummary("ALL", null, "Hyderabad");
        assertEquals(1, hyderabadSearch.getJobs().size());
        assertEquals("TechM", hyderabadSearch.getJobs().get(0).getCompany());
    }
}
