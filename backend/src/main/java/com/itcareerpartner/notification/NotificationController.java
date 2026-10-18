package com.itcareerpartner.notification;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<NotificationSummaryDto> getSummary(@RequestParam(defaultValue = "user_arjun") String userId) {
        return ResponseEntity.ok(notificationService.getSummary(userId));
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<Map<String, Object>> markAsRead(@PathVariable String id) {
        boolean success = notificationService.markAsRead(id);
        return ResponseEntity.ok(Map.of("success", success, "id", id));
    }

    @PostMapping("/mark-all-read")
    public ResponseEntity<Map<String, Object>> markAllAsRead(@RequestParam(defaultValue = "user_arjun") String userId) {
        int count = notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(Map.of("success", true, "markedCount", count));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteNotification(@PathVariable String id) {
        boolean deleted = notificationService.deleteNotification(id);
        return ResponseEntity.ok(Map.of("success", deleted, "id", id));
    }

    @GetMapping("/preferences")
    public ResponseEntity<NotificationPreferences> getPreferences(@RequestParam(defaultValue = "user_arjun") String userId) {
        return ResponseEntity.ok(notificationService.getPreferences(userId));
    }

    @PutMapping("/preferences")
    public ResponseEntity<NotificationPreferences> updatePreferences(
            @RequestParam(defaultValue = "user_arjun") String userId,
            @RequestBody NotificationPreferences preferences) {
        return ResponseEntity.ok(notificationService.updatePreferences(userId, preferences));
    }

    @PostMapping("/toggle-pause")
    public ResponseEntity<Map<String, Object>> togglePause(@RequestParam(defaultValue = "user_arjun") String userId) {
        String newStatus = notificationService.toggleAlertStatus(userId);
        return ResponseEntity.ok(Map.of("success", true, "alertStatus", newStatus));
    }

    @PostMapping("/{id}/retry-dispatch")
    public ResponseEntity<Map<String, Object>> retryDispatch(@PathVariable String id) {
        return ResponseEntity.ok(notificationService.retryDispatch(id));
    }
}
