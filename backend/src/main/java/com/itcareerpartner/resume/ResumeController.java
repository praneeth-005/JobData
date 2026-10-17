package com.itcareerpartner.resume;

import com.itcareerpartner.resume.dto.ResumeDtos.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping({"/resumes", "/api/v1/resumes"})
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:4173", "http://localhost:3000"}, allowCredentials = "true")
public class ResumeController {

    private static final Logger log = LoggerFactory.getLogger(ResumeController.class);
    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @GetMapping("/current")
    public ResponseEntity<ResumeVersion> getCurrentResume(@RequestParam(value = "userId", required = false, defaultValue = "user_arjun") String userId) {
        return ResponseEntity.ok(resumeService.getCurrentResume(userId));
    }

    @GetMapping("/overview")
    public ResponseEntity<ResumeOverview> getResumeOverview(@RequestParam(value = "userId", required = false, defaultValue = "user_arjun") String userId) {
        return ResponseEntity.ok(resumeService.getResumeOverview(userId));
    }

    @GetMapping("/versions")
    public ResponseEntity<List<ResumeVersion>> getAllVersions(@RequestParam(value = "userId", required = false, defaultValue = "user_arjun") String userId) {
        return ResponseEntity.ok(resumeService.getAllVersions(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResumeVersion> getResumeById(@PathVariable String id) {
        return ResponseEntity.ok(resumeService.getResumeById(id));
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "versionLabel", required = false) String versionLabel,
            @RequestParam(value = "userId", required = false, defaultValue = "user_arjun") String userId
    ) {
        try {
            ResumeUploadResponse response = resumeService.uploadResume(file, userId, versionLabel);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            log.warn("Validation error uploading resume: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(java.util.Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Server error processing resume upload", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(java.util.Map.of("error", "Failed to process resume: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadResume(@PathVariable String id) {
        try {
            ResumeVersion version = resumeService.getResumeById(id);
            Resource resource = resumeService.downloadResumeResource(id);

            String filename = (version != null && version.getFileName() != null)
                    ? version.getFileName()
                    : "resume.pdf";

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .body(resource);
        } catch (IOException e) {
            log.error("Error streaming resume binary: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/{id}/job-match")
    public ResponseEntity<MultiJobMatchResponse> getJobMatch(@PathVariable String id) {
        return ResponseEntity.ok(resumeService.getMultiJobMatch(id));
    }

    @GetMapping("/job-match")
    public ResponseEntity<MultiJobMatchResponse> getCurrentJobMatch() {
        return ResponseEntity.ok(resumeService.getMultiJobMatch(null));
    }

    @GetMapping("/{id}/improvements")
    public ResponseEntity<ImprovementsResponse> getImprovements(@PathVariable String id) {
        return ResponseEntity.ok(resumeService.getImprovements(id));
    }

    @GetMapping("/improvements")
    public ResponseEntity<ImprovementsResponse> getCurrentImprovements() {
        return ResponseEntity.ok(resumeService.getImprovements(null));
    }

    @GetMapping("/compare")
    public ResponseEntity<VersionDiffResponse> compareVersions(
            @RequestParam(value = "from", required = false) String from,
            @RequestParam(value = "to", required = false) String to
    ) {
        return ResponseEntity.ok(resumeService.compareVersions(from, to));
    }
}
