package com.itcareerpartner.job;

import com.itcareerpartner.common.ApiResponse;
import com.itcareerpartner.job.dto.CompanyItemDto;
import com.itcareerpartner.job.dto.IngestCompanyRequest;
import com.itcareerpartner.job.dto.JobEligibilityDto;
import com.itcareerpartner.job.dto.JobSearchResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:4173", "http://localhost:3000"}, allowCredentials = "true")
public class JobController {

    private final FoundJobService foundJobService;

    public JobController(FoundJobService foundJobService) {
        this.foundJobService = foundJobService;
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<JobSearchResponseDto>> searchJobs(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String company,
            @RequestParam(required = false) Double minCtc,
            @RequestParam(required = false) String workMode,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String batch,
            @RequestParam(required = false) String interviewMode,
            @RequestParam(required = false) String sort) {
        JobSearchResponseDto response = foundJobService.searchJobs(q, company, minCtc, workMode, city, batch, interviewMode, sort);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/companies")
    public ResponseEntity<ApiResponse<List<CompanyItemDto>>> getCompanies() {
        List<CompanyItemDto> companies = foundJobService.getCompaniesList();
        return ResponseEntity.ok(ApiResponse.ok(companies));
    }

    @PostMapping("/ingest-company")
    public ResponseEntity<ApiResponse<FoundJob>> ingestCompany(@RequestBody IngestCompanyRequest request) {
        FoundJob created = foundJobService.ingestCompany(request.getCompanyName());
        return ResponseEntity.ok(ApiResponse.ok(created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FoundJob>> getJobById(@PathVariable String id) {
        FoundJob job = foundJobService.getJobById(id);
        if (job == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ApiResponse.ok(job));
    }

    @GetMapping("/{id}/eligibility")
    public ResponseEntity<ApiResponse<JobEligibilityDto>> getJobEligibility(@PathVariable String id) {
        JobEligibilityDto dto = foundJobService.getJobEligibility(id);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @PostMapping("/{id}/save")
    public ResponseEntity<ApiResponse<FoundJob>> toggleSave(@PathVariable String id) {
        FoundJob job = foundJobService.toggleSaveJob(id);
        return ResponseEntity.ok(ApiResponse.ok(job));
    }
}
