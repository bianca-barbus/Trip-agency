package com.project.service.impl;

import com.project.model.Booking;
import com.project.model.BookingStatus;
import com.project.repository.BookingRepository;
import com.project.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {
    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public Booking addBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    @Override
    public List<Booking> getAllBookings() {
        return (List<Booking>) bookingRepository.findAll();
    }

    @Override
    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id).orElse(null);
    }

    @Override
    public void cancelBooking(Long id) {
        bookingRepository.deleteById(id);
    }

    @Override
    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUser_UserId(userId);
    }

    @Override
    public Booking updateBookingStatus(Long bookingId, BookingStatus status) {
        return bookingRepository.findById(bookingId)
                .map(booking -> {
                    booking.setStatus(status);
                    return bookingRepository.save(booking);
                })
                .orElse(null);
    }
}