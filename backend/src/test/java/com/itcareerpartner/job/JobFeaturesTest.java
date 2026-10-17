package com.itcareerpartner.job;

import com.itcareerpartner.job.dto.*;
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
        assertEquals(3, verifiedOnly.getAllCount());
        assertEquals(1, verifiedOnly.getVerifiedCount());
        assertEquals(1, verifiedOnly.getReviewCount());
        assertEquals(1, verifiedOnly.getFilteredCount());
        assertEquals(1, verifiedOnly.getJobs().size());
        assertEquals("Thoughtworks", verifiedOnly.getJobs().get(0).getCompany());

        FoundJobSummaryDto hyderabadSearch = foundJobService.getFoundJobsSummary("ALL", null, "Hyderabad");
        assertEquals(1, hyderabadSearch.getJobs().size());
        assertEquals("TechM", hyderabadSearch.getJobs().get(0).getCompany());
    }

    @Test
    @DisplayName("Search Any Software IT Company: Multi-company query, case-insensitivity and CTC filtering")
    void testSearchAnySoftwareITCompany() {
        List<FoundJob> mockJobs = new ArrayList<>();
        FoundJob j1 = new FoundJob("Associate Software Engineer", "Rakuten", "Bengaluru", "Bengaluru", "₹9.0 LPA", 9.0, "FULL_TIME", "Verified Fresher", "VERIFIED", "1h ago", "Rakuten Portal", "https://rakuten.in", "RAK", null);
        j1.setSkills(List.of("Java", "Spring Boot", "React"));
        j1.setWorkMode("Hybrid");
        j1.setBatchAllowed("2026 / 2025");
        FoundJob j2 = new FoundJob("Junior Developer", "Zoho", "Chennai", "Chennai", "₹5.6 LPA", 5.6, "FULL_TIME", "Verified Fresher", "VERIFIED", "2h ago", "Zoho Portal", "https://zoho.com", "ZH", null);
        j2.setSkills(List.of("Java", "C++", "SQL"));
        j2.setWorkMode("On-site");
        j2.setBatchAllowed("2026 / 2025 / 2024");
        FoundJob j3 = new FoundJob("Software Engineer Backend", "Swiggy", "Bengaluru", "Bengaluru", "₹6.0 LPA", 6.0, "FULL_TIME", "Verified Fresher", "VERIFIED", "3h ago", "Swiggy Portal", "https://swiggy.com", "SW", null);
        j3.setSkills(List.of("Go", "Java", "Kafka"));
        j3.setWorkMode("Hybrid");
        j3.setBatchAllowed("2026 / 2025");
        mockJobs.add(j1);
        mockJobs.add(j2);
        mockJobs.add(j3);

        when(foundJobRepository.findAllByOrderByCreatedAtDesc()).thenReturn(mockJobs);

        // Search Rakuten (case-insensitive)
        JobSearchResponseDto rakutenRes = foundJobService.searchJobs("rakuten", null, null, null, null, null, null, null);
        assertEquals(1, rakutenRes.getTotalFound());
        assertEquals("Rakuten", rakutenRes.getJobs().get(0).getCompany());

        // Search Zoho by company param
        JobSearchResponseDto zohoRes = foundJobService.searchJobs(null, "Zoho", null, null, null, null, null, null);
        assertEquals(1, zohoRes.getTotalFound());
        assertEquals("Zoho", zohoRes.getJobs().get(0).getCompany());

        // Search by skill across all IT companies
        JobSearchResponseDto javaRes = foundJobService.searchJobs("Java", null, null, null, null, null, null, null);
        assertEquals(3, javaRes.getTotalFound());

        // Filter by min CTC >= 8.0 LPA
        JobSearchResponseDto ctcRes = foundJobService.searchJobs(null, null, 8.0, null, null, null, null, null);
        assertEquals(1, ctcRes.getTotalFound());
        assertEquals("Rakuten", ctcRes.getJobs().get(0).getCompany());
    }

    @Test
    @DisplayName("Companies Autocomplete: Returns verified corporate directory")
    void testGetCanonicalAndDynamicCompaniesList() {
        when(foundJobRepository.findAll()).thenReturn(List.of());

        List<CompanyItemDto> companies = foundJobService.getCompaniesList();
        assertNotNull(companies);
        assertTrue(companies.size() >= 20, "Should include canonical list of top IT employers");

        boolean hasThoughtworks = companies.stream().anyMatch(c -> c.getName().equalsIgnoreCase("Thoughtworks"));
        boolean hasSwiggy = companies.stream().anyMatch(c -> c.getName().equalsIgnoreCase("Swiggy"));
        boolean hasZoho = companies.stream().anyMatch(c -> c.getName().equalsIgnoreCase("Zoho"));
        boolean hasInfosys = companies.stream().anyMatch(c -> c.getName().equalsIgnoreCase("Infosys"));
        boolean hasTcs = companies.stream().anyMatch(c -> c.getName().equalsIgnoreCase("Tata Consultancy Services"));

        assertTrue(hasThoughtworks, "Should list Thoughtworks");
        assertTrue(hasSwiggy, "Should list Swiggy");
        assertTrue(hasZoho, "Should list Zoho");
        assertTrue(hasInfosys, "Should list Infosys");
        assertTrue(hasTcs, "Should list TCS");
    }

    @Test
    @DisplayName("On-Demand Ingestion: Creates verified fresher opportunity for searched company")
    void testOnDemandCompanyIngestion() {
        when(foundJobRepository.findAll()).thenReturn(List.of());
        when(foundJobRepository.save(any(FoundJob.class))).thenAnswer(invocation -> invocation.getArgument(0));

        FoundJob ingested = foundJobService.ingestCompany("Persistent Systems");
        assertNotNull(ingested);
        assertEquals("Persistent Systems", ingested.getCompany());
        assertTrue(ingested.getCtcLpa() >= 2.4, "Must satisfy >= 2.4 LPA statutory floor");
        assertEquals("VERIFIED", ingested.getStatus());
        assertEquals("0 Years / Fresher Scope", ingested.getExperienceText());
    }

    @Test
    @DisplayName("Job Eligibility: Deterministic 5-rule gate & weighted candidate scoring")
    void testDeterministicEligibilityEvaluation() {
        FoundJob swiggyJob = new FoundJob("Associate Software Engineer", "Swiggy", "Bengaluru", "Bengaluru", "₹6.0 LPA", 6.0, "FULL_TIME", "Verified Fresher", "VERIFIED", "1h ago", "Swiggy Portal", "https://swiggy.com", "SW", null);
        swiggyJob.setId("job-swg");
        swiggyJob.setJobMatchScore(88);
        swiggyJob.setBatchAllowed("2026 / 2025");

        when(foundJobRepository.findById("job-swg")).thenReturn(Optional.of(swiggyJob));

        JobEligibilityDto eligibility = foundJobService.getJobEligibility("job-swg");
        assertNotNull(eligibility);
        assertTrue(eligibility.isEligible(), "Must pass all 5 mandatory eligibility rules");
        assertEquals(5, eligibility.getHardRules().size());
        assertEquals("Pass", eligibility.getHardRules().get(0).getStatus()); // Strict IT Role
        assertEquals("Pass", eligibility.getHardRules().get(1).getStatus()); // Fresher scope
        assertEquals("Pass", eligibility.getHardRules().get(2).getStatus()); // Full-time salary floor >= 2.4L
        assertEquals(88, eligibility.getOverallFitScore());
        assertEquals(5, eligibility.getCandidateBreakdown().size());
    }

    @Test
    @DisplayName("Mandatory 2026 Batch Enforcement: Excludes jobs that do not include 2026 passout batch")
    void testMandatory2026BatchEnforcement() {
        List<FoundJob> jobs = new ArrayList<>();
        FoundJob j2026 = new FoundJob("SWE 2026", "Swiggy", "Bengaluru", "Bengaluru", "₹16.0 LPA", 6.0, "FULL_TIME", "Verified Fresher", "VERIFIED", "10m ago", "Swiggy Portal", "https://swiggy.com", "SW", null);
        j2026.setBatchAllowed("2026 / 2025");

        FoundJob jNo2026 = new FoundJob("Older Opening", "Infosys", "Bengaluru", "Bengaluru", "₹9.5 LPA", 9.5, "FULL_TIME", "Verified Fresher", "VERIFIED", "1h ago", "Infy Portal", "https://infy.com", "INF", null);
        jNo2026.setBatchAllowed("2024 / 2025"); // Only older batches, NO 2026!

        jobs.add(j2026);
        jobs.add(jNo2026);

        when(foundJobRepository.findAllByOrderByCreatedAtDesc()).thenReturn(jobs);

        JobSearchResponseDto res = foundJobService.searchJobs(null, null, null, null, null, null, null, null);
        assertEquals(1, res.getTotalFound(), "Must strictly exclude any job not permitting 2026 batch");
        assertEquals("Swiggy", res.getJobs().get(0).getCompany());
        assertTrue(res.getJobs().get(0).getBatchAllowed().contains("2026"));
    }
}