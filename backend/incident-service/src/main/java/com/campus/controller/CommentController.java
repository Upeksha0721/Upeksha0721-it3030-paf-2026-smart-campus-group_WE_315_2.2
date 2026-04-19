package com.campus.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campus.dto.CommentRequest;
import com.campus.dto.TicketDTO;
import com.campus.service.IncidentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class CommentController {

    private final IncidentService incidentService;

    @PostMapping("/{ticketId}/comments")
    public ResponseEntity<TicketDTO.CommentDTO> addComment(
            @PathVariable Long ticketId,
            @Valid @RequestBody CommentRequest request,
            Authentication authentication) {
        String userId = authentication.getName();
        return ResponseEntity.ok(incidentService.addComment(ticketId, request, userId));
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<TicketDTO.CommentDTO> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CommentRequest request,
            Authentication authentication) {
        String userId = authentication.getName();
        return ResponseEntity.ok(incidentService.updateComment(commentId, request, userId));
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            Authentication authentication) {
        String userId = authentication.getName();
        incidentService.deleteComment(commentId, userId);
        return ResponseEntity.noContent().build();
    }
}
