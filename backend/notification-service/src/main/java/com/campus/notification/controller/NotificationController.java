package com.campus.notification.controller;

import com.campus.notification.model.Notification;
import com.campus.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    // GET notifications by query param for easier frontend integration
    @GetMapping
    public ResponseEntity<List<Notification>> getNotificationsByQuery(
            @RequestParam(required = false) Long userId) {
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId query parameter is required");
        }
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }

    // GET all notifications for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(
            @PathVariable Long userId) {
        return ResponseEntity.ok(
                notificationService.getUserNotifications(userId));
    }

    // GET unread count for a user
    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @PathVariable Long userId) {
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    // POST create a notification
    @PostMapping
    public ResponseEntity<Notification> createNotification(
            @RequestBody Map<String, String> body) {
        Long userId;
        Notification.NotificationType type;

        try {
            userId = Long.parseLong(body.get("userId"));
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid or missing userId");
        }

        try {
            type = Notification.NotificationType.valueOf(body.get("type").toUpperCase());
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid or missing notification type");
        }

        String message = body.get("message");
        if (message == null || message.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Message is required");
        }

        Notification notification = notificationService.createNotification(
                userId,
                type,
                message.trim()
        );
        return ResponseEntity.ok(notification);
    }

    // PUT mark single notification as read
    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    // PUT mark all as read for a user
    @PutMapping("/user/{userId}/read-all")
    public ResponseEntity<?> markAllAsRead(@PathVariable Long userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    // DELETE notification
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok(Map.of("message", "Notification deleted"));
    }
}