package com.itcareerpartner.job;

import com.itcareerpartner.job.dto.FoundJobSummaryDto;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class FoundJobService {

    private static final Logger log = LoggerFactory.getLogger(FoundJobService.class);
    private final FoundJobRepository foundJobRepository;

    public FoundJobService(FoundJobRepository foundJobRepository) {
        this.foundJobRepository = foundJobRepository;
    }

    @PostConstruct
    public void initDefaultFoundJobs() {
        try {
            if (foundJobRepository.count() == 0) {
                List<FoundJob> defaults = new ArrayList<>();

                // 1. Thoughtworks
                FoundJob j1 = new FoundJob(
                        "Graduate Software Engineer (Java / Backend)",
                        "Thoughtworks",
                        "Bengaluru • Hybrid",
                        "Bengaluru",
                        "₹8.5 LPA (Confirmed)",
                        8.5,
                        "FULL_TIME",
                        "Verified Fresher",
                        "VERIFIED",
                        "25 mins ago",
                        "Thoughtworks Official Career Page",
                        "https://thoughtworks.com/careers",
                        "TW",
                        null
                );
                defaults.add(j1);

                // 2. Swiggy
                FoundJob j2 = new FoundJob(
                        "Associate Software Engineer - 2025 Batch",
                        "Swiggy",
                        "Bengaluru / Hyderabad • In-office",
                        "Bengaluru",
                        "₹6.0 LPA (Confirmed)",
                        6.0,
                        "FULL_TIME",
                        "Verified Fresher",
                        "VERIFIED",
                        "1 hour ago",
                        "Swiggy Careers",
                        "https://swiggy.com/careers/engineering",
                        "SW",
                        null
                );
                defaults.add(j2);

                // 3. Zoho
                FoundJob j3 = new FoundJob(
                        "Junior Full-Stack Developer Intern",
                        "Zoho Corporation",
                        "Chennai • On-campus",
                        "Chennai",
                        "₹15,000 / month (Paid Internship)",
                        1.8,
                        "INTERNSHIP",
                        "Paid Internship",
                        "VERIFIED",
                        "2 hours ago",
                        "Zoho Careers",
                        "https://zoho.com/careers",
                        "ZH",
                        null
                );
                defaults.add(j3);

                // 4. Tech Mahindra (Review)
                FoundJob j4 = new FoundJob(
                        "Frontend Developer Trainee",
                        "Tech Mahindra",
                        "Hyderabad • On-site",
                        "Hyderabad",
                        "₹3.6 LPA (Confirmed)",
                        3.6,
                        "TRAINEE",
                        "Review Details",
                        "REVIEW",
                        "4 hours ago",
                        "Campus Portal",
                        "https://careers.techmahindra.com",
                        "TM",
                        "Verification notice: Interview format not specified by company. Verify if remote test or on-premises round."
                );
                defaults.add(j4);

                // 5. Filtered out example 1
                FoundJob j5 = new FoundJob(
                        "Senior Cloud Solutions Architect",
                        "Infosys Digital",
                        "Bengaluru • Hybrid",
                        "Bengaluru",
                        "₹24.0 LPA",
                        24.0,
                        "FULL_TIME",
                        "Excluded",
                        "FILTERED",
                        "5 hours ago",
                        "Infosys Career Feed",
                        "https://infosys.com",
                        "INF",
                        null
                );
                j5.setFilterReason("Requires 3+ years experience. Non-fresher posting.");
                defaults.add(j5);

                // 6. Filtered out example 2
                FoundJob j6 = new FoundJob(
                        "Technical Support Associate (Voice)",
                        "Vertex Solutions",
                        "Pune • On-site",
                        "Pune",
                        "₹2.1 LPA",
                        2.1,
                        "FULL_TIME",
                        "Excluded",
                        "FILTERED",
                        "6 hours ago",
                        "Job Board Feed",
                        "https://vertex.com",
                        "VX",
                        null
                );
                j6.setFilterReason("Non-technical BPO & below ₹2.4 LPA minimum living wage.");
                defaults.add(j6);

                foundJobRepository.saveAll(defaults);
            }
        } catch (Exception e) {
            log.warn("Notice during initial found jobs seeding: {}", e.getMessage());
        }
    }

    public FoundJobSummaryDto getFoundJobsSummary(String tab, String query, String location) {
        List<FoundJob> allJobs = foundJobRepository.findAllByOrderByCreatedAtDesc();

        int allCount = (int) allJobs.stream().filter(j -> !"FILTERED".equalsIgnoreCase(j.getStatus())).count();
        int verifiedCount = (int) allJobs.stream().filter(j -> "VERIFIED".equalsIgnoreCase(j.getStatus())).count();
        int reviewCount = (int) allJobs.stream().filter(j -> "REVIEW".equalsIgnoreCase(j.getStatus())).count();
        int filteredCount = (int) allJobs.stream().filter(j -> "FILTERED".equalsIgnoreCase(j.getStatus())).count();

        List<FoundJob> filtered = allJobs.stream().filter(job -> {
            // Tab filter
            if (tab != null && !tab.trim().isEmpty() && !tab.equalsIgnoreCase("ALL")) {
                if (tab.equalsIgnoreCase("VERIFIED") && !"VERIFIED".equalsIgnoreCase(job.getStatus())) {
                    return false;
                }
                if (tab.equalsIgnoreCase("REVIEW") && !"REVIEW".equalsIgnoreCase(job.getStatus())) {
                    return false;
                }
                if (tab.equalsIgnoreCase("FILTERED") && !"FILTERED".equalsIgnoreCase(job.getStatus())) {
                    return false;
                }
            } else {
                // By default 'ALL' displays active discovery (verified + review), not filtered out
                if ("FILTERED".equalsIgnoreCase(job.getStatus())) {
                    return false;
                }
            }

            // Text search
            if (query != null && !query.trim().isEmpty()) {
                String q = query.trim().toLowerCase(Locale.ROOT);
                boolean matches = (job.getTitle() != null && job.getTitle().toLowerCase(Locale.ROOT).contains(q))
                        || (job.getCompany() != null && job.getCompany().toLowerCase(Locale.ROOT).contains(q))
                        || (job.getLocation() != null && job.getLocation().toLowerCase(Locale.ROOT).contains(q))
                        || (job.getSourceName() != null && job.getSourceName().toLowerCase(Locale.ROOT).contains(q));
                if (!matches) return false;
            }

            // Location filter
            if (location != null && !location.trim().isEmpty()) {
                String loc = location.trim().toLowerCase(Locale.ROOT);
                boolean matches = (job.getLocation() != null && job.getLocation().toLowerCase(Locale.ROOT).contains(loc))
                        || (job.getCity() != null && job.getCity().toLowerCase(Locale.ROOT).contains(loc));
                if (!matches) return false;
            }

            return true;
        }).collect(Collectors.toList());

        return new FoundJobSummaryDto(allCount, verifiedCount, reviewCount, filteredCount, filtered);
    }

    public FoundJob toggleSaveJob(String id) {
        FoundJob job = foundJobRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Found job not found with ID: " + id));
        job.setSaved(!job.isSaved());
        return foundJobRepository.save(job);
    }

    public int openAllInMainFeed() {
        List<FoundJob> verifiedJobs = foundJobRepository.findByStatus("VERIFIED");
        // In real system this flags them for user feed
        return verifiedJobs.size();
    }
}
