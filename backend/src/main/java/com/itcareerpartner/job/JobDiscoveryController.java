package com.itcareerpartner.job;

import com.itcareerpartner.common.ApiResponse;
import com.itcareerpartner.job.dto.StartScanRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/job-discovery")
public class JobDiscoveryController {

    private final JobDiscoveryService discoveryService;

    public JobDiscoveryController(JobDiscoveryService discoveryService) {
        this.discoveryService = discoveryService;
    }

    @PostMapping("/scan")
    public ResponseEntity<ApiResponse<DiscoveryScan>> startScan(@RequestBody(required = false) StartScanRequest request) {
        DiscoveryScan scan = discoveryService.startScan("candidate-default", request);
        return ResponseEntity.ok(ApiResponse.ok(scan));
    }

    @GetMapping("/scan/latest")
    public ResponseEntity<ApiResponse<DiscoveryScan>> getLatestScan() {
        DiscoveryScan scan = discoveryService.getLatestScan("candidate-default");
        return ResponseEntity.ok(ApiResponse.ok(scan));
    }

    @PostMapping("/scan/{id}/stop")
    public ResponseEntity<ApiResponse<DiscoveryScan>> stopScan(@PathVariable String id) {
        DiscoveryScan scan = discoveryService.stopScan(id);
        return ResponseEntity.ok(ApiResponse.ok(scan));
    }

    @PostMapping("/scan/{id}/complete")
    public ResponseEntity<ApiResponse<DiscoveryScan>> completeScan(@PathVariable String id) {
        DiscoveryScan scan = discoveryService.completeScan(id);
        return ResponseEntity.ok(ApiResponse.ok(scan));
    }
}
