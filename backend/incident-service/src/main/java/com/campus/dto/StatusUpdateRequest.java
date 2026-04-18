package com.campus.dto;

import com.campus.model.TicketStatus;
import lombok.Data;

@Data
public class StatusUpdateRequest {
    private TicketStatus status;
    private String reason; // for REJECTED status
    private String resolutionNotes; // for RESOLVED status
}
