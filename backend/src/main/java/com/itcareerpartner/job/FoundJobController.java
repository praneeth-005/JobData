package com.itcareerpartner.job;

import com.itcareerpartner.common.ApiResponse;
import com.itcareerpartner.job.dto.FoundJobSummaryDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/found-jobs")
public class FoundJobController {

    private final FoundJobService foundJobService;

    public FoundJobController(FoundJobService foundJobService) {
        this.foundJobService = foundJobService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<FoundJobSummaryDto>> getFoundJobs(
            @RequestParam(required = false) String tab,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String location) {
        FoundJobSummaryDto summary = foundJobService.getFoundJobsSummary(tab, q, location);
        return ResponseEntity.ok(ApiResponse.ok(summary));
    }

    @PostMapping("/{id}/save")
    public ResponseEntity<ApiResponse<FoundJob>> toggleSave(@PathVariable String id) {
        FoundJob updated = foundJobService.toggleSaveJob(id);
        return ResponseEntity.ok(ApiResponse.ok(updated));
    }

    @PostMapping("/open-all-feed")
    public ResponseEntity<ApiResponse<Map<String, Object>>> openAllInMainFeed() {
        int count = foundJobService.openAllInMainFeed();
        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "routedCount", count,
                "message", "All " + count + " verified jobs have been routed directly into your Recommended Feed."
        )));
    }
}
