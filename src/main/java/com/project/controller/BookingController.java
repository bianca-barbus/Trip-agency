package com.project.controller;

import com.project.model.Booking;
import com.project.model.BookingStatus;
import com.project.model.User;
import com.project.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping()
    public ResponseEntity<Booking> createBooking(@RequestBody Booking request) {
        if (request.getBookingDate() == null) {
            request.setBookingDate(LocalDateTime.now()); // Set the current date/time if null
        }

        return ResponseEntity.ok(bookingService.addBooking(request));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<Booking>> getUserBookings(@RequestParam("userId") Long userId) {
        if (userId == null) {
            return ResponseEntity.badRequest().body(null);  // Or return a meaningful error message
        }
        return ResponseEntity.ok(bookingService.getBookingsByUser(userId));
    }



    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(@PathVariable Long id, @RequestBody String status) {
        // Handle potential invalid status
        try {
            BookingStatus bookingStatus = BookingStatus.valueOf(status.toUpperCase());
            return ResponseEntity.ok(bookingService.updateBookingStatus(id, bookingStatus));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);  // Return a bad request for invalid status
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.noContent().build();
    }
}
