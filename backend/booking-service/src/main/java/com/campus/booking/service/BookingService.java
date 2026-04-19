package com.campus.booking.service;

import com.campus.booking.dto.BookingRequest;
import com.campus.booking.exception.BadRequestException;
import com.campus.booking.exception.ConflictException;
import com.campus.booking.exception.NotFoundException;
import com.campus.booking.model.Booking;
import com.campus.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private static final List<Booking.BookingStatus> ACTIVE_STATUSES = List.of(
            Booking.BookingStatus.PENDING,
            Booking.BookingStatus.APPROVED
    );

    public List<Booking> getBookings(String userId, Booking.BookingStatus status, LocalDate bookingDate, String resourceName) {
        return bookingRepository.findAll().stream()
                .filter(booking -> userId == null || booking.getUserId().equalsIgnoreCase(userId))
                .filter(booking -> status == null || booking.getStatus() == status)
                .filter(booking -> bookingDate == null || booking.getBookingDate().equals(bookingDate))
                .filter(booking -> resourceName == null || booking.getResourceName().equalsIgnoreCase(resourceName))
                .sorted(Comparator.comparing(Booking::getBookingDate).thenComparing(Booking::getStartTime))
                .collect(Collectors.toList());
    }

    public Booking createBooking(BookingRequest request) {
        validateTimeRange(request.startTime(), request.endTime());

        ensureNoConflict(
                null,
                request.bookingDate(),
                request.resourceName(),
                request.startTime(),
                request.endTime()
        );

        Booking booking = new Booking();
        booking.setResourceName(request.resourceName().trim());
        booking.setResourceType(request.resourceType().trim());
        booking.setUserId(request.userId().trim());
        booking.setUserName(request.userName().trim());
        booking.setBookingDate(request.bookingDate());
        booking.setStartTime(request.startTime());
        booking.setEndTime(request.endTime());
        booking.setPurpose(request.purpose().trim());
        booking.setExpectedAttendees(request.expectedAttendees());
        booking.setNeedsProjector(request.needsProjector());
        booking.setNeedsWhiteboard(request.needsWhiteboard());
        booking.setStatus(Booking.BookingStatus.PENDING);
        booking.setRejectionReason(null);

        return bookingRepository.save(booking);
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Booking not found for id: " + id));
    }

    public List<Booking> getBookingsByUser(String userId) {
        return bookingRepository.findByUserId(userId).stream()
                .sorted(Comparator.comparing(Booking::getBookingDate).thenComparing(Booking::getStartTime))
                .collect(Collectors.toList());
    }

    public Booking approveBooking(Long id) {
        Booking booking = getBookingById(id);
        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new BadRequestException("Only PENDING bookings can be approved");
        }

        ensureNoConflict(
                booking.getId(),
                booking.getBookingDate(),
                booking.getResourceName(),
                booking.getStartTime(),
                booking.getEndTime()
        );

        booking.setStatus(Booking.BookingStatus.APPROVED);
        booking.setRejectionReason(null);
        return bookingRepository.save(booking);
    }

    public Booking rejectBooking(Long id, String reason) {
        Booking booking = getBookingById(id);
        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new BadRequestException("Only PENDING bookings can be rejected");
        }
        booking.setStatus(Booking.BookingStatus.REJECTED);
        booking.setRejectionReason(reason == null ? null : reason.trim());
        return bookingRepository.save(booking);
    }

    public Booking cancelBooking(Long id) {
        Booking booking = getBookingById(id);
        if (booking.getStatus() != Booking.BookingStatus.PENDING
                && booking.getStatus() != Booking.BookingStatus.APPROVED) {
            throw new BadRequestException("Only PENDING or APPROVED bookings can be cancelled");
        }
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }

    public void deleteBooking(Long id) {
        if (!bookingRepository.existsById(id)) {
            throw new NotFoundException("Booking not found for id: " + id);
        }
        bookingRepository.deleteById(id);
    }

    private void validateTimeRange(java.time.LocalTime startTime, java.time.LocalTime endTime) {
        if (Objects.isNull(startTime) || Objects.isNull(endTime) || !startTime.isBefore(endTime)) {
            throw new BadRequestException("startTime must be before endTime");
        }
    }

    private void ensureNoConflict(Long bookingId, LocalDate bookingDate, String resourceName, java.time.LocalTime startTime, java.time.LocalTime endTime) {
        List<Booking> conflicts = bookingRepository
                .findByBookingDateAndResourceNameAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(
                        bookingDate,
                        resourceName,
                        ACTIVE_STATUSES,
                        endTime,
                        startTime
                );

        boolean conflictExists = conflicts.stream()
                .anyMatch(existing -> bookingId == null || !existing.getId().equals(bookingId));

        if (conflictExists) {
            throw new ConflictException("Booking time overlaps with an existing booking for the same resource");
        }
    }
}