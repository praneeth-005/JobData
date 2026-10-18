package com.itcareerpartner.tracker;

import com.itcareerpartner.tracker.dto.TrackerDtos.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/tracker", "/api/v1/tracker"})
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:4173", "http://localhost:3000"}, allowCredentials = "true")
public class TrackerController {

    private static final Logger log = LoggerFactory.getLogger(TrackerController.class);
    private final TrackerService trackerService;

    public TrackerController(TrackerService trackerService) {
        this.trackerService = trackerService;
    }

    @GetMapping("/kanban")
    public ResponseEntity<KanbanBoardResponse> getKanbanBoard(
            @RequestParam(value = "userId", required = false, defaultValue = "user_arjun") String userId
    ) {
        return ResponseEntity.ok(trackerService.getKanbanBoard(userId));
    }

    @GetMapping("/applications")
    public ResponseEntity<List<JobApplication>> getApplications(
            @RequestParam(value = "userId", required = false, defaultValue = "user_arjun") String userId
    ) {
        return ResponseEntity.ok(trackerService.getAllApplications(userId));
    }

    @GetMapping("/applications/{id}")
    public ResponseEntity<?> getApplicationById(@PathVariable String id) {
        JobApplication app = trackerService.getApplicationById(id);
        if (app == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Application not found: " + id));
        }
        return ResponseEntity.ok(app);
    }

    @PostMapping("/applications")
    public ResponseEntity<JobApplication> createApplication(
            @RequestBody CreateApplicationRequest req,
            @RequestParam(value = "userId", required = false, defaultValue = "user_arjun") String userId
    ) {
        JobApplication created = trackerService.createApplication(req, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/applications/{id}")
    public ResponseEntity<?> updateApplication(
            @PathVariable String id,
            @RequestBody UpdateApplicationRequest req
    ) {
        try {
            JobApplication updated = trackerService.updateApplication(id, req);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/applications/{id}")
    public ResponseEntity<?> deleteApplication(@PathVariable String id) {
        trackerService.deleteApplication(id);
        return ResponseEntity.ok(Map.of("success", true, "deletedId", id));
    }

    @GetMapping("/saved-jobs")
    public ResponseEntity<SavedJobsResponse> getSavedJobs(
            @RequestParam(value = "userId", required = false, defaultValue = "user_arjun") String userId
    ) {
        return ResponseEntity.ok(trackerService.getSavedJobs(userId));
    }

    @PostMapping("/saved-jobs")
    public ResponseEntity<SavedJobItem> saveJob(
            @RequestBody SavedJobItem item,
            @RequestParam(value = "userId", required = false, defaultValue = "user_arjun") String userId
    ) {
        SavedJobItem saved = trackerService.saveJob(item, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/saved-jobs/{jobId}")
    public ResponseEntity<?> unsaveJob(
            @PathVariable String jobId,
            @RequestParam(value = "userId", required = false, defaultValue = "user_arjun") String userId
    ) {
        trackerService.unsaveJob(jobId, userId);
        return ResponseEntity.ok(Map.of("success", true, "unsavedJobId", jobId));
    }

    @GetMapping("/schedule")
    public ResponseEntity<ScheduleHubResponse> getScheduleHub(
            @RequestParam(value = "userId", required = false, defaultValue = "user_arjun") String userId
    ) {
        return ResponseEntity.ok(trackerService.getScheduleHub(userId));
    }

    @PostMapping("/activities")
    public ResponseEntity<ActivityItem> logActivity(
            @RequestBody ActivityItem activity,
            @RequestParam(value = "userId", required = false, defaultValue = "user_arjun") String userId
    ) {
        ActivityItem created = trackerService.logActivity(activity, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/activities/{id}/status")
    public ResponseEntity<?> updateActivityStatus(
            @PathVariable String id,
            @RequestParam("status") String status
    ) {
        ActivityItem updated = trackerService.updateActivityStatus(id, status);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Activity not found: " + id));
        }
        return ResponseEntity.ok(updated);
    }
}
