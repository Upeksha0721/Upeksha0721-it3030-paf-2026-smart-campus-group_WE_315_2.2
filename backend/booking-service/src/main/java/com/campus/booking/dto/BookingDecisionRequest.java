package com.campus.booking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BookingDecisionRequest(
        @NotBlank(message = "reason is required")
        @Size(max = 255, message = "reason must be at most 255 characters")
        String reason
) {
}
