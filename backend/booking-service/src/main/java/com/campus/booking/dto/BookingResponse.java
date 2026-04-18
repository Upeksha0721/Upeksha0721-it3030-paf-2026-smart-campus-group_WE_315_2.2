package com.campus.booking.dto;

import com.campus.booking.model.Booking;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record BookingResponse(
        Long id,
        String resourceName,
        String resourceType,
        String userId,
        String userName,
        LocalDate bookingDate,
        LocalTime startTime,
        LocalTime endTime,
        String purpose,
        int expectedAttendees,
        boolean needsProjector,
        boolean needsWhiteboard,
        Booking.BookingStatus status,
        String rejectionReason,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static BookingResponse fromEntity(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getResourceName(),
                booking.getResourceType(),
                booking.getUserId(),
                booking.getUserName(),
                booking.getBookingDate(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getPurpose(),
                booking.getExpectedAttendees(),
                booking.isNeedsProjector(),
                booking.isNeedsWhiteboard(),
                booking.getStatus(),
                booking.getRejectionReason(),
                booking.getCreatedAt(),
                booking.getUpdatedAt()
        );
    }
}
