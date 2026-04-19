package com.campus.dto;

import com.campus.model.Priority;
import com.campus.model.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketDTO {
    private Long id;
    private String category;
    private String description;
    private Priority priority;
    private String contactDetails;
    private TicketStatus status;
    private String userId;
    private String assignedTechnicianId;
    private String rejectionReason;
    private String resolutionNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<AttachmentDTO> attachments;
    private List<CommentDTO> comments;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AttachmentDTO {
        private Long id;
        private String fileName;
        private String fileUrl;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CommentDTO {
        private Long id;
        private String userId;
        private String content;
        private LocalDateTime createdAt;
    }
}
