package com.campus.booking.repository;

import com.campus.booking.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(String userId);
    List<Booking> findByStatus(Booking.BookingStatus status);
    List<Booking> findByBookingDate(LocalDate bookingDate);

    List<Booking> findByBookingDateAndResourceNameAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(
            LocalDate bookingDate,
            String resourceName,
            List<Booking.BookingStatus> statuses,
            LocalTime endTime,
            LocalTime startTime
    );
}