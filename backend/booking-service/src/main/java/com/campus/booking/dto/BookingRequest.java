package com.campus.booking.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalTime;

public record BookingRequest(
        @NotBlank(message = "resourceName is required")
        @Size(max = 120, message = "resourceName must be at most 120 characters")
        String resourceName,

        @NotBlank(message = "resourceType is required")
        @Size(max = 80, message = "resourceType must be at most 80 characters")
        String resourceType,

        @NotBlank(message = "userId is required")
        @Size(max = 80, message = "userId must be at most 80 characters")
        String userId,

        @NotBlank(message = "userName is required")
        @Size(max = 120, message = "userName must be at most 120 characters")
        String userName,

        @NotNull(message = "bookingDate is required")
        @FutureOrPresent(message = "bookingDate must be today or a future date")
        LocalDate bookingDate,

        @NotNull(message = "startTime is required")
        LocalTime startTime,

        @NotNull(message = "endTime is required")
        LocalTime endTime,

        @NotBlank(message = "purpose is required")
        @Size(max = 255, message = "purpose must be at most 255 characters")
        String purpose,

        @Min(value = 1, message = "expectedAttendees must be at least 1")
        @Max(value = 5000, message = "expectedAttendees cannot exceed 5000")
        int expectedAttendees,

        boolean needsProjector,
        boolean needsWhiteboard
) {
}
