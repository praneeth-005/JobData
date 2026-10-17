package com.itcareerpartner.job;

import com.itcareerpartner.common.ApiResponse;
import com.itcareerpartner.job.dto.AddJobSourceRequest;
import com.itcareerpartner.job.dto.JobSourceSummaryDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/job-sources")
public class JobSourceController {

    private final JobSourceService jobSourceService;

    public JobSourceController(JobSourceService jobSourceService) {
        this.jobSourceService = jobSourceService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<JobSourceSummaryDto>> getSources(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status) {
        JobSourceSummaryDto summary = jobSourceService.getJobSourcesSummary(q, type, status);
        return ResponseEntity.ok(ApiResponse.ok(summary));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<JobSource>> addSource(@Valid @RequestBody AddJobSourceRequest request) {
        JobSource created = jobSourceService.addJobSource(request);
        return ResponseEntity.ok(ApiResponse.ok(created));
    }

    @PostMapping("/{id}/check")
    public ResponseEntity<ApiResponse<JobSource>> checkNow(@PathVariable String id) {
        JobSource updated = jobSourceService.checkNow(id);
        return ResponseEntity.ok(ApiResponse.ok(updated));
    }
}
