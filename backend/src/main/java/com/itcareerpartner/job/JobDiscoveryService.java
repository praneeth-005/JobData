package com.itcareerpartner.job;

import com.itcareerpartner.job.dto.StartScanRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Service
public class JobDiscoveryService {

    private final DiscoveryScanRepository scanRepository;
    private final JobSourceRepository jobSourceRepository;

    public JobDiscoveryService(DiscoveryScanRepository scanRepository, JobSourceRepository jobSourceRepository) {
        this.scanRepository = scanRepository;
        this.jobSourceRepository = jobSourceRepository;
    }

    public DiscoveryScan startScan(String userId, StartScanRequest request) {
        String scope = (request != null && request.getScope() != null) ? request.getScope().toUpperCase() : "ALL";
        String targetName = request != null ? request.getTargetCompanyName() : null;
        String sourceId = request != null ? request.getTargetSourceId() : null;

        if ("SINGLE".equalsIgnoreCase(scope) && (targetName == null || targetName.trim().isEmpty()) && sourceId != null) {
            Optional<JobSource> sourceOpt = jobSourceRepository.findById(sourceId);
            if (sourceOpt.isPresent()) {
                targetName = sourceOpt.get().getCompanyName();
            }
        }

        DiscoveryScan scan = new DiscoveryScan(userId, scope, targetName, sourceId);
        scan.setStatus("IN_PROGRESS");
        scan.setProgressPercent(65);
        scan.setCurrentStepIndex(3);
        scan.setCurrentCheckDescription("Checking eligibility & salary requirements (≥ ₹2.4 LPA minimum)");

        if ("SINGLE".equalsIgnoreCase(scope)) {
            scan.setPostingsScanned(18);
            scan.setFresherJobsFound(6);
            scan.setFilteredOut(8);
            scan.setDuplicatesIgnored(4);
        } else {
            scan.setPostingsScanned(72);
            scan.setFresherJobsFound(34);
            scan.setFilteredOut(26);
            scan.setDuplicatesIgnored(12);
        }

        return scanRepository.save(scan);
    }

    public DiscoveryScan getLatestScan(String userId) {
        Optional<DiscoveryScan> latest = scanRepository.findTopByOrderByStartedAtDesc();
        if (latest.isPresent()) {
            return latest.get();
        }
        // Initialize default scan
        DiscoveryScan defaultScan = new DiscoveryScan();
        defaultScan.setUserId(userId != null ? userId : "candidate-default");
        return scanRepository.save(defaultScan);
    }

    public DiscoveryScan stopScan(String scanId) {
        DiscoveryScan scan = scanRepository.findById(scanId)
                .orElseGet(() -> getLatestScan("candidate-default"));
        scan.setStatus("STOPPED");
        scan.setCurrentCheckDescription("Search paused by candidate. Feed preserved.");
        scan.setCompletedAt(Instant.now());
        return scanRepository.save(scan);
    }

    public DiscoveryScan completeScan(String scanId) {
        DiscoveryScan scan = scanRepository.findById(scanId)
                .orElseGet(() -> getLatestScan("candidate-default"));
        scan.setStatus("COMPLETED");
        scan.setProgressPercent(100);
        scan.setCurrentStepIndex(4);
        scan.setCurrentCheckDescription("Discovery complete: All verified fresher roles added to feed.");
        scan.setCompletedAt(Instant.now());
        return scanRepository.save(scan);
    }
}
