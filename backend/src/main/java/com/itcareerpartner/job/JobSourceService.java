package com.itcareerpartner.job;

import com.itcareerpartner.job.dto.AddJobSourceRequest;
import com.itcareerpartner.job.dto.JobSourceSummaryDto;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class JobSourceService {

    private static final Logger log = LoggerFactory.getLogger(JobSourceService.class);
    private final JobSourceRepository jobSourceRepository;

    public JobSourceService(JobSourceRepository jobSourceRepository) {
        this.jobSourceRepository = jobSourceRepository;
    }

    @PostConstruct
    public void initDefaultSources() {
        try {
            seedSourceIfAbsent("Thoughtworks", "Thoughtworks Careers", "https://thoughtworks.com/careers", "PORTAL", "TW", 18, "ACTIVE", "Active & Checking", "25 mins ago");
            seedSourceIfAbsent("Swiggy", "Swiggy Tech Careers", "https://swiggy.com/careers/engineering", "API", "SW", 6, "ACTIVE", "Active & Checking", "1 hour ago");
            seedSourceIfAbsent("Zoho", "Zoho Careers Portal", "https://zoho.com/careers", "PORTAL", "ZH", 8, "SLOWDOWN", "Temporary Slowdown", "3 hours ago");
            seedSourceIfAbsent("Infosys", "Infosys Early Careers", "https://infosys.com/careers", "CAMPUS", "INF", 16, "ACTIVE", "Active & Checking", "4 hours ago");
            seedSourceIfAbsent("TCS", "TCS NextStep & iON", "https://on.tcs.com/campus", "CAMPUS", "TCS", 12, "ACTIVE", "Active & Checking", "6 hours ago");
        } catch (Exception e) {
            log.warn("Notice during initial job sources seeding: {}", e.getMessage());
        }
    }

    private void seedSourceIfAbsent(String company, String portalName, String url, String type, String logo, int count, String status, String statusDesc, String lastChecked) {
        if (!jobSourceRepository.existsByCompanyNameIgnoreCase(company)) {
            JobSource s = new JobSource(company, portalName, url, type, logo, count);
            s.setStatus(status);
            s.setStatusDescription(statusDesc);
            s.setLastCheckedText(lastChecked);
            jobSourceRepository.save(s);
        }
    }

    public JobSourceSummaryDto getJobSourcesSummary(String query, String type, String status) {
        List<JobSource> all = jobSourceRepository.findAllByOrderByCreatedAtDesc();

        List<JobSource> filtered = all.stream().filter(source -> {
            if (query != null && !query.trim().isEmpty()) {
                String q = query.trim().toLowerCase(Locale.ROOT);
                boolean matches = (source.getCompanyName() != null && source.getCompanyName().toLowerCase(Locale.ROOT).contains(q))
                        || (source.getPortalName() != null && source.getPortalName().toLowerCase(Locale.ROOT).contains(q))
                        || (source.getPortalUrl() != null && source.getPortalUrl().toLowerCase(Locale.ROOT).contains(q));
                if (!matches) return false;
            }

            if (type != null && !type.trim().isEmpty() && !type.equalsIgnoreCase("ALL")) {
                if (source.getSourceType() == null || !source.getSourceType().equalsIgnoreCase(type.trim())) {
                    return false;
                }
            }

            if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("ALL")) {
                if (status.equalsIgnoreCase("ACTIVE") && !"ACTIVE".equalsIgnoreCase(source.getStatus())) {
                    return false;
                }
                if (status.equalsIgnoreCase("SLOWDOWN") && !"SLOWDOWN".equalsIgnoreCase(source.getStatus())) {
                    return false;
                }
            }

            return true;
        }).collect(Collectors.toList());

        int totalPortals = all.size();
        int openOpportunities = all.stream().mapToInt(JobSource::getFresherJobsCount).sum();
        String systemHealthText = "All channels running smoothly";

        return new JobSourceSummaryDto(totalPortals, openOpportunities, systemHealthText, filtered);
    }

    public JobSource addJobSource(AddJobSourceRequest request) {
        String name = request.getCompanyName().trim();
        String portalName = request.getPortalName();
        if (portalName == null || portalName.trim().isEmpty()) {
            portalName = name + " Careers";
        }

        String logo = generateLogoText(name);

        String type = "PORTAL";
        if (request.getSourceType() != null && !request.getSourceType().trim().isEmpty()) {
            String rawType = request.getSourceType().toUpperCase(Locale.ROOT);
            if (rawType.contains("CAMPUS")) type = "CAMPUS";
            else if (rawType.contains("API") || rawType.contains("PARTNER")) type = "API";
        }

        JobSource source = new JobSource(name, portalName, request.getPortalUrl().trim(), type, logo, 4);
        source.setStatus("ACTIVE");
        source.setStatusDescription("Active & Checking");
        source.setLastCheckedText("Just now");
        source.setLastCheckedAt(Instant.now());

        return jobSourceRepository.save(source);
    }

    public JobSource checkNow(String id) {
        JobSource source = jobSourceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Job source not found: " + id));

        source.setLastCheckedAt(Instant.now());
        source.setLastCheckedText("Just now");
        source.setStatus("ACTIVE");
        source.setStatusDescription("Active & Checking");
        source.setFresherJobsCount(source.getFresherJobsCount() + 1);
        source.setUpdatedAt(Instant.now());

        return jobSourceRepository.save(source);
    }

    private String generateLogoText(String name) {
        if (name == null || name.trim().isEmpty()) return "CO";
        String[] parts = name.trim().split("\\s+");
        if (parts.length >= 2) {
            return (parts[0].substring(0, 1) + parts[1].substring(0, 1)).toUpperCase(Locale.ROOT);
        } else if (name.length() >= 2) {
            return name.substring(0, 2).toUpperCase(Locale.ROOT);
        }
        return name.toUpperCase(Locale.ROOT);
    }
}
