package com.itcareerpartner.tracker;

import com.itcareerpartner.tracker.dto.TrackerDtos.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class TrackerService {

    private static final Logger log = LoggerFactory.getLogger(TrackerService.class);

    private final JobApplicationRepository applicationRepository;
    private final SavedJobRepository savedJobRepository;
    private final ActivityRepository activityRepository;

    // Resilient thread-safe memory stores
    private final Map<String, JobApplication> inMemoryApplications = new ConcurrentHashMap<>();
    private final Map<String, SavedJobItem> inMemorySavedJobs = new ConcurrentHashMap<>();
    private final Map<String, ActivityItem> inMemoryActivities = new ConcurrentHashMap<>();

    public TrackerService(
            JobApplicationRepository applicationRepository,
            SavedJobRepository savedJobRepository,
            ActivityRepository activityRepository
    ) {
        this.applicationRepository = applicationRepository;
        this.savedJobRepository = savedJobRepository;
        this.activityRepository = activityRepository;

        seedDefaultPursuits();
    }

    public KanbanBoardResponse getKanbanBoard(String userId) {
        String effectiveUser = sanitizeUser(userId);
        List<JobApplication> all = getAllApplications(effectiveUser);

        List<JobApplication> appliedList = all.stream().filter(a -> a.getStage() == ApplicationStage.APPLIED).collect(Collectors.toList());
        List<JobApplication> reviewList = all.stream().filter(a -> a.getStage() == ApplicationStage.UNDER_REVIEW || a.getStage() == ApplicationStage.ASSESSMENT_SCHEDULED).collect(Collectors.toList());
        List<JobApplication> interviewList = all.stream().filter(a -> a.getStage() == ApplicationStage.TECHNICAL_INTERVIEW || a.getStage() == ApplicationStage.FINAL_ROUND).collect(Collectors.toList());
        List<JobApplication> offerList = all.stream().filter(a -> a.getStage() == ApplicationStage.OFFER_EXTENDED).collect(Collectors.toList());
        List<JobApplication> archivedList = all.stream().filter(a -> a.getStage() == ApplicationStage.REJECTED || a.getStage() == ApplicationStage.ARCHIVED).collect(Collectors.toList());

        List<KanbanColumn> columns = List.of(
                new KanbanColumn(ApplicationStage.APPLIED, "Applied / Submitted", "bg-[#e2e8f0] text-[#475569]", appliedList.size(), appliedList),
                new KanbanColumn(ApplicationStage.UNDER_REVIEW, "Under Review & Tests", "bg-[#eef2ff] text-[#4338ca]", reviewList.size(), reviewList),
                new KanbanColumn(ApplicationStage.TECHNICAL_INTERVIEW, "Interviews Scheduled", "bg-[#faf5ff] text-[#9333ea]", interviewList.size(), interviewList),
                new KanbanColumn(ApplicationStage.OFFER_EXTENDED, "Offers Extended", "bg-[#ecfdf5] text-[#059669]", offerList.size(), offerList),
                new KanbanColumn(ApplicationStage.ARCHIVED, "Archived / Inactive", "bg-[#f1f5f9] text-[#94a3b8]", archivedList.size(), archivedList)
        );

        int inProgress = reviewList.size() + interviewList.size();
        return new KanbanBoardResponse(all.size(), inProgress, interviewList.size(), offerList.size(), columns);
    }

    public List<JobApplication> getAllApplications(String userId) {
        String effectiveUser = sanitizeUser(userId);
        List<JobApplication> memList = inMemoryApplications.values().stream()
                .filter(a -> a.getUserId().equals(effectiveUser))
                .sorted(Comparator.comparing(JobApplication::getCreatedAt).reversed())
                .collect(Collectors.toList());

        if (!memList.isEmpty()) {
            return memList;
        }

        try {
            List<JobApplication> list = applicationRepository.findByUserIdOrderByCreatedAtDesc(effectiveUser);
            if (list != null && !list.isEmpty()) {
                list.forEach(a -> inMemoryApplications.put(a.getId(), a));
                return list;
            }
        } catch (Exception e) {
            log.warn("Mongo lookup failed for applications of {}: {}. Serving in-memory store.", effectiveUser, e.getMessage());
        }

        return memList;
    }

    public JobApplication getApplicationById(String id) {
        JobApplication memApp = inMemoryApplications.get(id);
        if (memApp != null) {
            return memApp;
        }
        try {
            Optional<JobApplication> opt = applicationRepository.findById(id);
            if (opt.isPresent()) {
                inMemoryApplications.put(id, opt.get());
                return opt.get();
            }
        } catch (Exception e) {
            log.warn("Mongo lookup failed for application {}: {}", id, e.getMessage());
        }
        return inMemoryApplications.values().stream().findFirst().orElse(null);
    }

    public JobApplication createApplication(CreateApplicationRequest req, String userId) {
        String effectiveUser = sanitizeUser(userId);
        String appId = "app_" + UUID.randomUUID().toString().substring(0, 8);

        JobApplication app = new JobApplication();
        app.setId(appId);
        app.setUserId(effectiveUser);
        app.setJobId(req.jobId() != null ? req.jobId() : "job_custom_" + System.currentTimeMillis());
        app.setCompany(req.company());
        app.setTitle(req.title());
        app.setLogoText(req.logoText() != null ? req.logoText() : req.company().substring(0, Math.min(2, req.company().length())).toUpperCase());
        app.setCtcText(req.ctcText() != null ? req.ctcText() : "₹12.0 - ₹15.0 LPA");
        app.setCtcLpa(req.ctcLpa() != null ? req.ctcLpa() : 12.0);
        app.setLocation(req.location() != null ? req.location() : "Bengaluru");
        app.setWorkMode(req.workMode() != null ? req.workMode() : "Hybrid");
        app.setBatchAllowed(req.batchAllowed() != null ? req.batchAllowed() : "2026 Batch");
        app.setStage(req.stage() != null ? req.stage() : ApplicationStage.APPLIED);
        app.setStatusLabel(stageToLabel(app.getStage()));
        app.setResumeVersionId(req.resumeVersionId() != null ? req.resumeVersionId() : "res_v21");
        app.setResumeVersionLabel(req.resumeVersionLabel() != null ? req.resumeVersionLabel() : "v2.1");
        app.setAppliedDateFormatted("Today");
        app.setAppliedDate(Instant.now());
        app.setPortalUrl(req.portalUrl() != null ? req.portalUrl() : "https://careers." + req.company().toLowerCase().replaceAll("\\s+", "") + ".com");
        app.setRecruiterContact(req.recruiterContact());
        app.setNotes(req.notes());
        app.setMatchScore(92);

        List<ApplicationTimelineItem> timeline = new ArrayList<>();
        timeline.add(new ApplicationTimelineItem(
                "tl_1",
                "Application Submitted",
                "Direct Portal Ingestion",
                "Applied via verified enterprise link using Master Resume v2.1",
                "Today",
                true,
                false,
                "send"
        ));
        timeline.add(new ApplicationTimelineItem(
                "tl_2",
                "Initial Review",
                "ATS Screening",
                "Automated 2026 batch and technical skills verification",
                "In Progress",
                false,
                true,
                "pending"
        ));
        app.setTimeline(timeline);

        saveApplicationSafe(app);
        return app;
    }

    public JobApplication updateApplication(String id, UpdateApplicationRequest req) {
        JobApplication app = getApplicationById(id);
        if (app == null) {
            throw new IllegalArgumentException("Application not found with ID: " + id);
        }

        if (req.company() != null) app.setCompany(req.company());
        if (req.title() != null) app.setTitle(req.title());
        if (req.ctcText() != null) app.setCtcText(req.ctcText());
        if (req.ctcLpa() != null) app.setCtcLpa(req.ctcLpa());
        if (req.location() != null) app.setLocation(req.location());
        if (req.workMode() != null) app.setWorkMode(req.workMode());
        if (req.stage() != null) {
            app.setStage(req.stage());
            app.setStatusLabel(stageToLabel(req.stage()));
        }
        if (req.statusLabel() != null) app.setStatusLabel(req.statusLabel());
        if (req.nextActionTitle() != null) app.setNextActionTitle(req.nextActionTitle());
        if (req.nextActionFormatted() != null) app.setNextActionFormatted(req.nextActionFormatted());
        if (req.recruiterContact() != null) app.setRecruiterContact(req.recruiterContact());
        if (req.notes() != null) app.setNotes(req.notes());
        app.setUpdatedAt(Instant.now());

        saveApplicationSafe(app);
        return app;
    }

    public void deleteApplication(String id) {
        inMemoryApplications.remove(id);
        try {
            applicationRepository.deleteById(id);
        } catch (Exception e) {
            log.warn("Mongo delete failed: {}", e.getMessage());
        }
    }

    public SavedJobsResponse getSavedJobs(String userId) {
        String effectiveUser = sanitizeUser(userId);
        List<SavedJobItem> list = inMemorySavedJobs.values().stream()
                .filter(j -> j.getUserId().equals(effectiveUser))
                .sorted(Comparator.comparing(SavedJobItem::getSavedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .collect(Collectors.toList());

        if (list.isEmpty()) {
            try {
                List<SavedJobItem> dbList = savedJobRepository.findByUserIdOrderBySavedAtDesc(effectiveUser);
                if (dbList != null && !dbList.isEmpty()) {
                    dbList.forEach(j -> inMemorySavedJobs.put(j.getId(), j));
                    list = dbList;
                }
            } catch (Exception e) {
                log.warn("Mongo lookup for saved jobs failed: {}", e.getMessage());
            }
        }

        long verifiedCount = list.stream().filter(j -> "VERIFIED_ELIGIBLE".equalsIgnoreCase(j.getVerificationStatus())).count();
        long reviewCount = list.stream().filter(j -> "NEEDS_REVIEW".equalsIgnoreCase(j.getVerificationStatus())).count();
        long closedCount = list.stream().filter(j -> "CLOSED".equalsIgnoreCase(j.getVerificationStatus())).count();

        return new SavedJobsResponse(list.size(), (int) verifiedCount, (int) reviewCount, (int) closedCount, list);
    }

    public SavedJobItem saveJob(SavedJobItem item, String userId) {
        String effectiveUser = sanitizeUser(userId);
        item.setUserId(effectiveUser);
        if (item.getId() == null || item.getId().isBlank()) {
            item.setId("saved_" + UUID.randomUUID().toString().substring(0, 8));
        }
        item.setSavedAt(Instant.now());
        inMemorySavedJobs.put(item.getId(), item);
        try {
            savedJobRepository.save(item);
        } catch (Exception e) {
            log.warn("Mongo save for savedJob failed: {}", e.getMessage());
        }
        return item;
    }

    public void unsaveJob(String jobId, String userId) {
        String effectiveUser = sanitizeUser(userId);
        inMemorySavedJobs.values().removeIf(j -> j.getUserId().equals(effectiveUser) && (j.getId().equals(jobId) || j.getJobId().equals(jobId)));
        try {
            savedJobRepository.deleteByUserIdAndJobId(effectiveUser, jobId);
        } catch (Exception e) {
            log.warn("Mongo delete savedJob failed: {}", e.getMessage());
        }
    }

    public ScheduleHubResponse getScheduleHub(String userId) {
        String effectiveUser = sanitizeUser(userId);
        List<ActivityItem> list = inMemoryActivities.values().stream()
                .filter(a -> a.getUserId().equals(effectiveUser))
                .sorted(Comparator.comparing(ActivityItem::getScheduledDateTime))
                .collect(Collectors.toList());

        if (list.isEmpty()) {
            try {
                List<ActivityItem> dbList = activityRepository.findByUserIdOrderByScheduledDateTimeAsc(effectiveUser);
                if (dbList != null && !dbList.isEmpty()) {
                    dbList.forEach(a -> inMemoryActivities.put(a.getId(), a));
                    list = dbList;
                }
            } catch (Exception e) {
                log.warn("Mongo lookup for activities failed: {}", e.getMessage());
            }
        }

        long interviewCount = list.stream().filter(a -> "INTERVIEW".equalsIgnoreCase(a.getActivityType())).count();
        long assessmentCount = list.stream().filter(a -> "ASSESSMENT".equalsIgnoreCase(a.getActivityType())).count();
        long followupCount = list.stream().filter(a -> "FOLLOW_UP".equalsIgnoreCase(a.getActivityType())).count();
        long overdueCount = list.stream().filter(a -> "OVERDUE".equalsIgnoreCase(a.getStatus())).count();

        return new ScheduleHubResponse(list.size(), (int) interviewCount, (int) assessmentCount, (int) followupCount, (int) overdueCount, list);
    }

    public ActivityItem logActivity(ActivityItem activity, String userId) {
        String effectiveUser = sanitizeUser(userId);
        activity.setUserId(effectiveUser);
        if (activity.getId() == null || activity.getId().isBlank()) {
            activity.setId("act_" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (activity.getScheduledDateTime() == null) {
            activity.setScheduledDateTime(Instant.now().plus(2, ChronoUnit.DAYS));
        }
        inMemoryActivities.put(activity.getId(), activity);
        try {
            activityRepository.save(activity);
        } catch (Exception e) {
            log.warn("Mongo save for activity failed: {}", e.getMessage());
        }
        return activity;
    }

    public ActivityItem updateActivityStatus(String activityId, String status) {
        ActivityItem item = inMemoryActivities.get(activityId);
        if (item != null) {
            item.setStatus(status);
            try {
                activityRepository.save(item);
            } catch (Exception ignored) {}
        }
        return item;
    }

    private void saveApplicationSafe(JobApplication app) {
        inMemoryApplications.put(app.getId(), app);
        try {
            applicationRepository.save(app);
        } catch (Exception e) {
            log.warn("Mongo save failed for application {}: {}", app.getId(), e.getMessage());
        }
    }

    private String sanitizeUser(String userId) {
        if (userId == null || userId.isBlank() || "undefined".equalsIgnoreCase(userId) || "null".equalsIgnoreCase(userId)) {
            return "user_arjun";
        }
        return userId;
    }

    private String stageToLabel(ApplicationStage stage) {
        return switch (stage) {
            case APPLIED -> "Applied / Submitted";
            case UNDER_REVIEW -> "Under Review";
            case ASSESSMENT_SCHEDULED -> "Assessment Scheduled";
            case TECHNICAL_INTERVIEW -> "Technical Interview (Round 2)";
            case FINAL_ROUND -> "Final Partner Round";
            case OFFER_EXTENDED -> "Offer Extended";
            case REJECTED -> "Position Filled";
            case ARCHIVED -> "Archived Pursuit";
        };
    }

    private void seedDefaultPursuits() {
        // App 1: Thoughtworks (Technical Interview Round 2)
        JobApplication app1 = new JobApplication();
        app1.setId("app_tw_01");
        app1.setUserId("user_arjun");
        app1.setJobId("job_tw_01");
        app1.setCompany("Thoughtworks");
        app1.setTitle("Graduate Software Engineer (2026 Batch)");
        app1.setLogoText("TW");
        app1.setCtcText("₹11.5 - ₹13.5 LPA");
        app1.setCtcLpa(12.5);
        app1.setLocation("Bengaluru / Pune (Hybrid)");
        app1.setWorkMode("Hybrid");
        app1.setBatchAllowed("2026 Batch");
        app1.setStage(ApplicationStage.TECHNICAL_INTERVIEW);
        app1.setStatusLabel("Technical Interview (Round 2)");
        app1.setResumeVersionId("res_v21");
        app1.setResumeVersionLabel("v2.1");
        app1.setAppliedDateFormatted("Oct 14, 2026");
        app1.setAppliedDate(Instant.now().minus(4, ChronoUnit.DAYS));
        app1.setNextActionFormatted("Tomorrow, 2:30 PM IST");
        app1.setNextActionDate(Instant.now().plus(1, ChronoUnit.DAYS));
        app1.setNextActionTitle("System Design & Pair Programming Round");
        app1.setPortalUrl("https://www.thoughtworks.com/careers/freshers-2026");
        app1.setRecruiterContact("Priya Sharma • Talent Acquisition Partner (priya.s@thoughtworks.com)");
        app1.setNotes("Reviewed Spring Boot Saga pattern and Kafka transactional outbox. Re-read OOP SOLID principles.");
        app1.setMatchScore(94);
        app1.setTimeline(List.of(
                new ApplicationTimelineItem("tl_tw_1", "Application Submitted", "Direct Career Portal", "Submitted with verified Master Resume v2.1", "Oct 14, 2026", true, false, "send"),
                new ApplicationTimelineItem("tl_tw_2", "Level-1 ATS Verified", "Resume Ingestion Cleared", "94% Match score confirmed across 2026 requirements", "Oct 15, 2026", true, false, "verified"),
                new ApplicationTimelineItem("tl_tw_3", "Technical Assessment", "Coding & Logic Challenge", "Passed with 98th percentile in Java & Algorithmic DS", "Oct 16, 2026", true, false, "code"),
                new ApplicationTimelineItem("tl_tw_4", "Technical Interview (Round 2)", "Live Pairing Session", "Scheduled with Lead Consultant via Google Meet", "Tomorrow, 2:30 PM", false, true, "event_repeat"),
                new ApplicationTimelineItem("tl_tw_5", "Leadership & Culture", "Values & Delivery Alignment", "Final conversational fitment interview", "Tentative Oct 23", false, false, "group"),
                new ApplicationTimelineItem("tl_tw_6", "Formal Offer Letter", "CTC ₹13.5 LPA + Retention Bonus", "Final verification & joining confirmation", "Pending", false, false, "celebration")
        ));
        inMemoryApplications.put(app1.getId(), app1);

        // App 2: Razorpay (Technical Round 1)
        JobApplication app2 = new JobApplication();
        app2.setId("app_rzp_02");
        app2.setUserId("user_arjun");
        app2.setJobId("job_rzp_02");
        app2.setCompany("Razorpay");
        app2.setTitle("Software Engineer 1 - Payments Core");
        app2.setLogoText("RZP");
        app2.setCtcText("₹16.0 - ₹20.0 LPA");
        app2.setCtcLpa(18.0);
        app2.setLocation("Bengaluru (On-Site)");
        app2.setWorkMode("On-Site");
        app2.setBatchAllowed("2026 Batch");
        app2.setStage(ApplicationStage.TECHNICAL_INTERVIEW);
        app2.setStatusLabel("Technical Round 1 (ACID & DB)");
        app2.setResumeVersionId("res_v21");
        app2.setResumeVersionLabel("v2.1");
        app2.setAppliedDateFormatted("Oct 12, 2026");
        app2.setAppliedDate(Instant.now().minus(6, ChronoUnit.DAYS));
        app2.setNextActionFormatted("Oct 21, 2026 at 4:00 PM");
        app2.setNextActionDate(Instant.now().plus(3, ChronoUnit.DAYS));
        app2.setNextActionTitle("PostgreSQL Indexing & Concurrency Round");
        app2.setPortalUrl("https://razorpay.com/jobs/payments-se1");
        app2.setRecruiterContact("Karthik M. • Engineering Hiring Lead");
        app2.setNotes("Online assessment scored 100/100 on multi-threading payment lock simulation.");
        app2.setMatchScore(91);
        inMemoryApplications.put(app2.getId(), app2);

        // App 3: Swiggy (Under Review)
        JobApplication app3 = new JobApplication();
        app3.setId("app_swg_03");
        app3.setUserId("user_arjun");
        app3.setJobId("job_swg_03");
        app3.setCompany("Swiggy");
        app3.setTitle("Associate Software Development Engineer");
        app3.setLogoText("SWG");
        app3.setCtcText("₹14.0 - ₹17.0 LPA");
        app3.setCtcLpa(15.5);
        app3.setLocation("Bengaluru (Hybrid)");
        app3.setWorkMode("Hybrid");
        app3.setBatchAllowed("2026 Batch");
        app3.setStage(ApplicationStage.UNDER_REVIEW);
        app3.setStatusLabel("Resume Screened (Top 5%)");
        app3.setResumeVersionId("res_v21");
        app3.setResumeVersionLabel("v2.1");
        app3.setAppliedDateFormatted("Oct 15, 2026");
        app3.setAppliedDate(Instant.now().minus(3, ChronoUnit.DAYS));
        app3.setNextActionFormatted("Oct 22, 2026");
        app3.setNextActionDate(Instant.now().plus(4, ChronoUnit.DAYS));
        app3.setNextActionTitle("Online Coding Assessment Link Release");
        app3.setPortalUrl("https://careers.swiggy.com/engineering-freshers");
        app3.setNotes("Application reviewed by Logistics Tech team.");
        app3.setMatchScore(88);
        inMemoryApplications.put(app3.getId(), app3);

        // App 4: PhonePe (Offer Extended)
        JobApplication app4 = new JobApplication();
        app4.setId("app_pp_04");
        app4.setUserId("user_arjun");
        app4.setJobId("job_pp_04");
        app4.setCompany("PhonePe");
        app4.setTitle("Software Engineer - Distributed Systems");
        app4.setLogoText("PP");
        app4.setCtcText("₹18.0 - ₹22.0 LPA");
        app4.setCtcLpa(20.0);
        app4.setLocation("Bengaluru (On-Site)");
        app4.setWorkMode("On-Site");
        app4.setBatchAllowed("2026 Batch");
        app4.setStage(ApplicationStage.OFFER_EXTENDED);
        app4.setStatusLabel("Official Offer Extended");
        app4.setResumeVersionId("res_v21");
        app4.setResumeVersionLabel("v2.1");
        app4.setAppliedDateFormatted("Sep 28, 2026");
        app4.setAppliedDate(Instant.now().minus(20, ChronoUnit.DAYS));
        app4.setNextActionFormatted("Accept by Oct 25, 2026");
        app4.setNextActionDate(Instant.now().plus(7, ChronoUnit.DAYS));
        app4.setNextActionTitle("Review & Execute Offer Acceptance Letter");
        app4.setPortalUrl("https://phonepe.com/careers");
        app4.setRecruiterContact("Ananya Sen • Senior University Recruiter");
        app4.setNotes("CTC: ₹20 LPA fixed + ₹2 LPA joining bonus. Zero service bond.");
        app4.setMatchScore(96);
        inMemoryApplications.put(app4.getId(), app4);

        // App 5: Zoho (Applied)
        JobApplication app5 = new JobApplication();
        app5.setId("app_zh_05");
        app5.setUserId("user_arjun");
        app5.setJobId("job_zh_04");
        app5.setCompany("Zoho Corporation");
        app5.setTitle("Member Technical Staff (MTS)");
        app5.setLogoText("ZH");
        app5.setCtcText("₹8.5 - ₹10.5 LPA");
        app5.setCtcLpa(9.5);
        app5.setLocation("Chennai / Tenkasi (On-Site)");
        app5.setWorkMode("On-Site");
        app5.setBatchAllowed("2026 Batch");
        app5.setStage(ApplicationStage.APPLIED);
        app5.setStatusLabel("Application Ingested");
        app5.setResumeVersionId("res_v21");
        app5.setResumeVersionLabel("v2.1");
        app5.setAppliedDateFormatted("Oct 17, 2026");
        app5.setAppliedDate(Instant.now().minus(1, ChronoUnit.DAYS));
        app5.setNextActionFormatted("Oct 26, 2026");
        app5.setNextActionDate(Instant.now().plus(8, ChronoUnit.DAYS));
        app5.setNextActionTitle("Zoho Advanced C/Java Round 1");
        app5.setPortalUrl("https://www.zoho.com/careers/campus-drive");
        app5.setNotes("Direct institutional registration for 2026 outgoing batch.");
        app5.setMatchScore(84);
        inMemoryApplications.put(app5.getId(), app5);

        // 2. Seed Saved Jobs
        SavedJobItem sj1 = new SavedJobItem();
        sj1.setId("sj_1");
        sj1.setUserId("user_arjun");
        sj1.setJobId("job_tw_01");
        sj1.setCompany("Thoughtworks");
        sj1.setTitle("Graduate Software Consultant (2026 Batch)");
        sj1.setLogoText("TW");
        sj1.setCtcText("₹11.5 - ₹13.5 LPA");
        sj1.setCtcLpa(12.5);
        sj1.setLocation("Bengaluru / Pune");
        sj1.setWorkMode("Hybrid");
        sj1.setBatchAllowed("2026 Batch");
        sj1.setJobType("FULL_TIME");
        sj1.setJobMatchScore(94);
        sj1.setApplyUrl("https://thoughtworks.com/careers");
        sj1.setDeadlineText("Apply by Oct 24, 2026");
        sj1.setVerificationStatus("VERIFIED_ELIGIBLE");
        sj1.setTags(List.of("Tier 1", "Clean Code", "No Bond"));
        sj1.setNotes("Top target: excellent pair-programming culture.");
        inMemorySavedJobs.put(sj1.getId(), sj1);

        SavedJobItem sj2 = new SavedJobItem();
        sj2.setId("sj_2");
        sj2.setUserId("user_arjun");
        sj2.setJobId("job_rzp_02");
        sj2.setCompany("Razorpay");
        sj2.setTitle("Software Engineer 1 - Payments Core");
        sj2.setLogoText("RZP");
        sj2.setCtcText("₹16.0 - ₹20.0 LPA");
        sj2.setCtcLpa(18.0);
        sj2.setLocation("Bengaluru");
        sj2.setWorkMode("On-Site");
        sj2.setBatchAllowed("2026 Batch");
        sj2.setJobType("FULL_TIME");
        sj2.setJobMatchScore(91);
        sj2.setApplyUrl("https://razorpay.com/careers");
        sj2.setDeadlineText("Apply by Oct 28, 2026");
        sj2.setVerificationStatus("VERIFIED_ELIGIBLE");
        sj2.setTags(List.of("Fintech Core", "PostgreSQL", "Zero Bond"));
        inMemorySavedJobs.put(sj2.getId(), sj2);

        SavedJobItem sj3 = new SavedJobItem();
        sj3.setId("sj_3");
        sj3.setUserId("user_arjun");
        sj3.setJobId("job_swg_03");
        sj3.setCompany("Swiggy");
        sj3.setTitle("Associate Software Development Engineer");
        sj3.setLogoText("SWG");
        sj3.setCtcText("₹14.0 - ₹17.0 LPA");
        sj3.setCtcLpa(15.5);
        sj3.setLocation("Bengaluru");
        sj3.setWorkMode("Hybrid");
        sj3.setBatchAllowed("2026 Batch");
        sj3.setJobType("FULL_TIME");
        sj3.setJobMatchScore(88);
        sj3.setApplyUrl("https://careers.swiggy.com");
        sj3.setDeadlineText("Apply by Oct 29, 2026");
        sj3.setVerificationStatus("VERIFIED_ELIGIBLE");
        sj3.setTags(List.of("High Throughput", "Docker", "Zero Bond"));
        inMemorySavedJobs.put(sj3.getId(), sj3);

        SavedJobItem sj4 = new SavedJobItem();
        sj4.setId("sj_4");
        sj4.setUserId("user_arjun");
        sj4.setJobId("job_gs_04");
        sj4.setCompany("Goldman Sachs");
        sj4.setTitle("Engineering Analyst - Global Markets");
        sj4.setLogoText("GS");
        sj4.setCtcText("₹24.0 - ₹28.0 LPA");
        sj4.setCtcLpa(25.0);
        sj4.setLocation("Bengaluru / Hyderabad");
        sj4.setWorkMode("On-Site");
        sj4.setBatchAllowed("2026 Batch");
        sj4.setJobType("FULL_TIME");
        sj4.setJobMatchScore(89);
        sj4.setApplyUrl("https://goldmansachs.com/careers");
        sj4.setDeadlineText("Aptitude Window Open");
        sj4.setVerificationStatus("NEEDS_REVIEW");
        sj4.setTags(List.of("Tier 1 Investment Bank", "Low Latency Java"));
        inMemorySavedJobs.put(sj4.getId(), sj4);

        SavedJobItem sj5 = new SavedJobItem();
        sj5.setId("sj_5");
        sj5.setUserId("user_arjun");
        sj5.setJobId("job_amz_05");
        sj5.setCompany("Amazon Web Services");
        sj5.setTitle("Software Development Engineer (SDE 1)");
        sj5.setLogoText("AWS");
        sj5.setCtcText("₹28.0 - ₹34.0 LPA");
        sj5.setCtcLpa(30.0);
        sj5.setLocation("Hyderabad");
        sj5.setWorkMode("Hybrid");
        sj5.setBatchAllowed("2026 Batch");
        sj5.setJobType("FULL_TIME");
        sj5.setJobMatchScore(85);
        sj5.setApplyUrl("https://amazon.jobs");
        sj5.setDeadlineText("Applications Closed for Batch 1");
        sj5.setVerificationStatus("CLOSED");
        sj5.setTags(List.of("Cloud Infrastructure", "Distributed Storage"));
        inMemorySavedJobs.put(sj5.getId(), sj5);

        // 3. Seed Activities
        ActivityItem act1 = new ActivityItem();
        act1.setId("act_1");
        act1.setUserId("user_arjun");
        act1.setApplicationId("app_tw_01");
        act1.setCompany("Thoughtworks");
        act1.setTitle("Live Technical Pairing & System Design Round");
        act1.setActivityType("INTERVIEW");
        act1.setScheduledDateFormatted("Tomorrow");
        act1.setScheduledTimeFormatted("2:30 PM - 3:30 PM IST");
        act1.setScheduledDateTime(Instant.now().plus(1, ChronoUnit.DAYS));
        act1.setDurationMinutes(60);
        act1.setPlatform("Google Meet");
        act1.setMeetingLink("https://meet.google.com/tw-eng-pairing-2026");
        act1.setInterviewer("Priya Sharma & Lead Architect");
        act1.setStatus("UPCOMING");
        act1.setChecklist(List.of(
                "Review event-driven order engine code on GitHub",
                "Prepare concurrency design pattern examples (Java 21 Virtual Threads vs ExecutorService)",
                "Review Thoughtworks core consulting principles"
        ));
        act1.setNotes("Camera required. Screen-sharing IDE setup with Java 21 SDK ready.");
        inMemoryActivities.put(act1.getId(), act1);

        ActivityItem act2 = new ActivityItem();
        act2.setId("act_2");
        act2.setUserId("user_arjun");
        act2.setApplicationId("app_rzp_02");
        act2.setCompany("Razorpay");
        act2.setTitle("PostgreSQL ACID & Concurrency Deep Dive");
        act2.setActivityType("INTERVIEW");
        act2.setScheduledDateFormatted("Oct 21, 2026");
        act2.setScheduledTimeFormatted("4:00 PM - 5:00 PM IST");
        act2.setScheduledDateTime(Instant.now().plus(3, ChronoUnit.DAYS));
        act2.setDurationMinutes(60);
        act2.setPlatform("Zoom");
        act2.setMeetingLink("https://zoom.us/j/rzp-payments-core-round1");
        act2.setInterviewer("Karthik M. (Payments Core Team)");
        act2.setStatus("UPCOMING");
        act2.setChecklist(List.of(
                "Explain B-tree compound indexing optimization",
                "Walk through PostgreSQL distributed saga pattern implemented in resume project"
        ));
        inMemoryActivities.put(act2.getId(), act2);

        ActivityItem act3 = new ActivityItem();
        act3.setId("act_3");
        act3.setUserId("user_arjun");
        act3.setApplicationId("app_swg_03");
        act3.setCompany("Swiggy");
        act3.setTitle("Online Assessment: DSA & Microservices Architecture");
        act3.setActivityType("ASSESSMENT");
        act3.setScheduledDateFormatted("Oct 22, 2026");
        act3.setScheduledTimeFormatted("Flexible 90-minute window");
        act3.setScheduledDateTime(Instant.now().plus(4, ChronoUnit.DAYS));
        act3.setDurationMinutes(90);
        act3.setPlatform("HackerEarth");
        act3.setMeetingLink("https://hackerearth.com/swiggy-fresher-drive-2026");
        act3.setStatus("UPCOMING");
        act3.setChecklist(List.of("Graph algorithms practice", "Sliding window rate-limiter practice"));
        inMemoryActivities.put(act3.getId(), act3);

        ActivityItem act4 = new ActivityItem();
        act4.setId("act_4");
        act4.setUserId("user_arjun");
        act4.setApplicationId("app_pp_04");
        act4.setCompany("PhonePe");
        act4.setTitle("Offer Review & Benefits Follow-up");
        act4.setActivityType("FOLLOW_UP");
        act4.setScheduledDateFormatted("Oct 24, 2026");
        act4.setScheduledTimeFormatted("11:30 AM IST");
        act4.setScheduledDateTime(Instant.now().plus(6, ChronoUnit.DAYS));
        act4.setDurationMinutes(30);
        act4.setPlatform("Phone Call");
        act4.setInterviewer("Ananya Sen (University Recruiting)");
        act4.setStatus("UPCOMING");
        act4.setChecklist(List.of("Clarify joining date options for 2026 graduation batch"));
        inMemoryActivities.put(act4.getId(), act4);

        ActivityItem act5 = new ActivityItem();
        act5.setId("act_5");
        act5.setUserId("user_arjun");
        act5.setApplicationId("app_zh_05");
        act5.setCompany("Zoho Corporation");
        act5.setTitle("Submit Academic Transcripts Proof");
        act5.setActivityType("DEADLINE");
        act5.setScheduledDateFormatted("Yesterday");
        act5.setScheduledTimeFormatted("11:59 PM IST");
        act5.setScheduledDateTime(Instant.now().minus(1, ChronoUnit.DAYS));
        act5.setDurationMinutes(15);
        act5.setPlatform("Zoho Portal");
        act5.setMeetingLink("https://zoho.com/careers/upload");
        act5.setStatus("OVERDUE");
        act5.setNotes("Reminder: upload 6th semester grade sheet showing 8.65 CGPA.");
        inMemoryActivities.put(act5.getId(), act5);
    }
}
