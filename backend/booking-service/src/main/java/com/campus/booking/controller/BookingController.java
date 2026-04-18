package com.campus.booking.controller;

import com.campus.booking.dto.BookingDecisionRequest;
import com.campus.booking.dto.BookingRequest;
import com.campus.booking.dto.BookingResponse;
import com.campus.booking.exception.BadRequestException;
import com.campus.booking.model.Booking;
import com.campus.booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.EnumMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    private final BookingService bookingService;

    // GET all bookings with filters
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAllBookings(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate bookingDate,
            @RequestParam(required = false) String resourceName
    ) {
        Booking.BookingStatus parsedStatus = parseStatus(status);
        List<BookingResponse> bookings = bookingService.getBookings(userId, parsedStatus, bookingDate, resourceName)
                .stream()
                .map(BookingResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getBookingStats() {
        List<Booking> bookings = bookingService.getBookings(null, null, null, null);
        Map<Booking.BookingStatus, Long> counts = bookings.stream()
                .collect(Collectors.groupingBy(Booking::getStatus, () -> new EnumMap<>(Booking.BookingStatus.class), Collectors.counting()));

        return ResponseEntity.ok(Map.of(
                "approved", counts.getOrDefault(Booking.BookingStatus.APPROVED, 0L),
                "pending", counts.getOrDefault(Booking.BookingStatus.PENDING, 0L),
                "rejected", counts.getOrDefault(Booking.BookingStatus.REJECTED, 0L),
                "cancelled", counts.getOrDefault(Booking.BookingStatus.CANCELLED, 0L)
        ));
    }

    // GET booking by ID
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(BookingResponse.fromEntity(bookingService.getBookingById(id)));
    }

    // GET bookings by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingResponse>> getBookingsByUser(@PathVariable String userId) {
        List<BookingResponse> bookings = bookingService.getBookingsByUser(userId)
                .stream()
                .map(BookingResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bookings);
    }

    // POST create booking
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest bookingRequest) {
        Booking saved = bookingService.createBooking(bookingRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(BookingResponse.fromEntity(saved));
    }

    // PATCH approve booking
    @PatchMapping("/{id}/approve")
    public ResponseEntity<BookingResponse> approveBooking(@PathVariable Long id) {
        return ResponseEntity.ok(BookingResponse.fromEntity(bookingService.approveBooking(id)));
    }

    // PATCH reject booking
    @PatchMapping("/{id}/reject")
    public ResponseEntity<BookingResponse> rejectBooking(
            @PathVariable Long id,
            @Valid @RequestBody BookingDecisionRequest decisionRequest
    ) {
        return ResponseEntity.ok(BookingResponse.fromEntity(
                bookingService.rejectBooking(id, decisionRequest.reason())
        ));
    }

    // PATCH cancel booking
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(@PathVariable Long id) {
        return ResponseEntity.ok(BookingResponse.fromEntity(bookingService.cancelBooking(id)));
    }

    // DELETE booking
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }

    private Booking.BookingStatus parseStatus(String status) {
        if (status == null || status.isBlank()) {
            return null;
        }
        try {
            return Booking.BookingStatus.valueOf(status.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid booking status: " + status);
        }
    }
}