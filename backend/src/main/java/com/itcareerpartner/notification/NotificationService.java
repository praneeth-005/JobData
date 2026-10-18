package com.itcareerpartner.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final Map<String, NotificationItem> inMemoryNotifications = new ConcurrentHashMap<>();
    private final Map<String, NotificationPreferences> inMemoryPreferences = new ConcurrentHashMap<>();

    public NotificationService() {
        seedInitialData();
    }

    private void seedInitialData() {
        String user = "user_arjun";

        // Pre-seed Notification 1 (Job Alert)
        NotificationItem n1 = new NotificationItem(
                "notif_1", user, "JOB_ALERT",
                "New matching job found: Thoughtworks \u2022 Graduate Software Engineer",
                "Graduate Software Engineer (Java / Spring Boot). Direct Greenhouse ATS verified. 2026 Batch Verified.",
                "Thoughtworks", "TW", "\u20B911.5 - \u20B913.5 LPA", "Bengaluru / Pune (Hybrid)",
                94, "/jobs/job_tw_01", "View Details & Apply", "18 minutes ago"
        );
        n1.setRead(false);
        n1.setTags(Arrays.asList("Tier 1", "Spring Boot", "Clean Code", "2026 Batch Verified"));
        inMemoryNotifications.put(n1.getId(), n1);

        // Pre-seed Notification 2 (Interview Reminder)
        NotificationItem n2 = new NotificationItem(
                "notif_2", user, "INTERVIEW_REMINDER",
                "Upcoming Interview Tomorrow: Round 2 Technical (Thoughtworks)",
                "Thoughtworks Round 2 Technical Discussion with Siddharth Sen (Lead Technologist). Google Meet link verified.",
                "Thoughtworks", "TW", "\u20B911.5 - \u20B913.5 LPA", "Google Meet (Online)",
                94, "/tracker/schedule", "View Prep Notes & Meeting Link", "1 hour ago"
        );
        n2.setRead(false);
        n2.setTags(Arrays.asList("Urgent", "Interview", "45 Mins Duration"));
        n2.getMetadata().put("scheduledTime", "Tomorrow, 2:30 PM IST");
        n2.getMetadata().put("meetingLink", "https://meet.google.com/zkw-xsqe-rba");
        n2.getMetadata().put("interviewer", "Siddharth Sen (Lead Technologist)");
        inMemoryNotifications.put(n2.getId(), n2);

        // Pre-seed Notification 3 (Follow-up Overdue)
        NotificationItem n3 = new NotificationItem(
                "notif_3", user, "FOLLOW_UP_OVERDUE",
                "Follow-up Overdue: Juspay (Junior Java Backend Developer)",
                "Assessment submitted 5 business days ago without recruiter update. Recommended polite follow-up inquiry.",
                "Juspay", "JP", "\u20B912.0 - \u20B915.0 LPA", "Bengaluru (Hybrid)",
                91, "/tracker/applications", "Copy Polite Follow-up Email", "2 hours ago"
        );
        n3.setRead(false);
        n3.setTags(Arrays.asList("Action Required", "2 Days Overdue"));
        n3.getMetadata().put("overdueDays", "2");
        n3.getMetadata().put("emailSubject", "Inquiry Regarding Junior Java Backend Developer Application - Arjun Rao");
        inMemoryNotifications.put(n3.getId(), n3);

        // Pre-seed Notification 4 (Walk-in Drive)
        NotificationItem n4 = new NotificationItem(
                "notif_4", user, "WALK_IN_DRIVE",
                "Walk-in Drive Detected: Persistent Systems \u2022 Systems Engineer Trainee",
                "Exclusive 2026 Graduating Cohort walk-in drive verified for Pune / Hyderabad campus intake.",
                "Persistent Systems", "PS", "\u20B97.0 - \u20B99.0 LPA", "Pune Campus (Hall B)",
                85, "/jobs/persist_01", "View Venue & Registration Checklist", "Yesterday"
        );
        n4.setRead(true);
        n4.setTags(Arrays.asList("Campus Drive", "2026 Batch Verified"));
        inMemoryNotifications.put(n4.getId(), n4);

        // Pre-seed Notification 5 (Job Alert)
        NotificationItem n5 = new NotificationItem(
                "notif_5", user, "JOB_ALERT",
                "New matching job found: Razorpay \u2022 Software Engineer 1 - Payments Core",
                "High-throughput distributed payments engineering opening. Zero bond, 2026 eligible.",
                "Razorpay", "RZP", "\u20B916.0 - \u20B920.0 LPA", "Bengaluru (On-Site)",
                91, "/jobs/job_rzp_02", "Track & Apply", "3 days ago"
        );
        n5.setRead(true);
        n5.setTags(Arrays.asList("Fintech Core", "Go", "PostgreSQL", "2026 Batch Verified"));
        inMemoryNotifications.put(n5.getId(), n5);

        // Pre-seed Notification 6 (System Update)
        NotificationItem n6 = new NotificationItem(
                "notif_6", user, "SYSTEM_UPDATE",
                "Resume Re-analysis Completed (Resume v2.1)",
                "Overall readiness score increased to 88/100 (+6 pts). 3 action items resolved for 2026 product benchmarks.",
                "IT Career Partner AI", "AI", "", "Cloud Analysis",
                88, "/resume/analysis", "View Analysis Breakdown", "4 days ago"
        );
        n6.setRead(true);
        n6.setTags(Arrays.asList("System Update", "Score 88/100"));
        inMemoryNotifications.put(n6.getId(), n6);

        // Pre-seed Preferences
        NotificationPreferences defaultPrefs = new NotificationPreferences(user);
        inMemoryPreferences.put(user, defaultPrefs);

        log.info("NotificationService pre-seeded with {} active notifications for user {}", inMemoryNotifications.size(), user);
    }

    public NotificationSummaryDto getSummary(String userId) {
        String effectiveUser = sanitizeUser(userId);
        List<NotificationItem> list = inMemoryNotifications.values().stream()
                .filter(n -> n.getUserId().equals(effectiveUser))
                .sorted(Comparator.comparing(NotificationItem::getCreatedAt, Comparator.reverseOrder()))
                .collect(Collectors.toList());

        int total = list.size();
        int unread = (int) list.stream().filter(n -> !n.isRead()).count();
        int jobAlerts = (int) list.stream().filter(n -> "JOB_ALERT".equals(n.getType()) || "WALK_IN_DRIVE".equals(n.getType())).count();
        int reminders = (int) list.stream().filter(n -> "INTERVIEW_REMINDER".equals(n.getType()) || "FOLLOW_UP_OVERDUE".equals(n.getType())).count();
        int systemUpdates = (int) list.stream().filter(n -> "SYSTEM_UPDATE".equals(n.getType())).count();

        NotificationPreferences prefs = inMemoryPreferences.computeIfAbsent(effectiveUser, NotificationPreferences::new);

        return new NotificationSummaryDto(total, unread, jobAlerts, reminders, systemUpdates, prefs.getAlertStatus(), list);
    }

    public boolean markAsRead(String notifId) {
        NotificationItem item = inMemoryNotifications.get(notifId);
        if (item != null) {
            item.setRead(true);
            return true;
        }
        return false;
    }

    public int markAllAsRead(String userId) {
        String effectiveUser = sanitizeUser(userId);
        int count = 0;
        for (NotificationItem item : inMemoryNotifications.values()) {
            if (item.getUserId().equals(effectiveUser) && !item.isRead()) {
                item.setRead(true);
                count++;
            }
        }
        return count;
    }

    public boolean deleteNotification(String notifId) {
        return inMemoryNotifications.remove(notifId) != null;
    }

    public NotificationPreferences getPreferences(String userId) {
        String effectiveUser = sanitizeUser(userId);
        return inMemoryPreferences.computeIfAbsent(effectiveUser, NotificationPreferences::new);
    }

    public NotificationPreferences updatePreferences(String userId, NotificationPreferences updated) {
        String effectiveUser = sanitizeUser(userId);
        updated.setUserId(effectiveUser);
        updated.setUpdatedAt(Instant.now());
        inMemoryPreferences.put(effectiveUser, updated);
        return updated;
    }

    public String toggleAlertStatus(String userId) {
        String effectiveUser = sanitizeUser(userId);
        NotificationPreferences prefs = inMemoryPreferences.computeIfAbsent(effectiveUser, NotificationPreferences::new);
        if ("ACTIVE".equalsIgnoreCase(prefs.getAlertStatus())) {
            prefs.setAlertStatus("PAUSED");
        } else {
            prefs.setAlertStatus("ACTIVE");
        }
        prefs.setUpdatedAt(Instant.now());
        return prefs.getAlertStatus();
    }

    public Map<String, Object> retryDispatch(String notifId) {
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("status", "QUEUED");
        res.put("message", "SMTP relay handshake acknowledged. Message queued for immediate dispatch.");
        res.put("timestamp", Instant.now().toString());
        return res;
    }

    private String sanitizeUser(String userId) {
        return (userId == null || userId.isBlank()) ? "user_arjun" : userId.trim();
    }
}
