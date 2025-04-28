package com.project.service;

import com.project.model.Booking;
import com.project.model.BookingStatus;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface BookingService {
    Booking addBooking(Booking booking);
    List<Booking> getAllBookings();
    Booking getBookingById(Long id);
    void cancelBooking(Long id);
    Booking updateBookingStatus(Long bookingId, BookingStatus status);
    List<Booking> getBookingsByUser(Long userId);
}