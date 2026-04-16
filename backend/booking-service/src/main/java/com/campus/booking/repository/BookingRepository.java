package com.campus.booking.repository;

import com.campus.booking.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Get bookings by user
    List<Booking> findByUserId(String userId);

    // Get bookings by status
    List<Booking> findByStatus(Booking.BookingStatus status);

    // Conflict checking query
    List<Booking> findByResourceNameAndStatusNotAndBookingDateAndStartTimeLessThanAndEndTimeGreaterThan(
            String resourceName,
            Booking.BookingStatus status,
            LocalDate bookingDate,
            LocalTime endTime,
            LocalTime startTime
    );
}