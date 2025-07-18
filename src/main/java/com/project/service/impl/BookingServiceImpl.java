package com.project.service.impl;

import com.project.model.Booking;
import com.project.model.BookingStatus;
import com.project.repository.BookingRepository;
import com.project.service.BookingService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {
    @Autowired
    private BookingRepository bookingRepository;

    @Transactional
    @Override
    public Booking addBooking(Booking booking) {
        Booking savedBooking = bookingRepository.save(booking);
        generateXmlForBooking(savedBooking);
        return savedBooking;
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

    private void generateXmlForBooking(Booking booking) {
        StringBuilder xml = new StringBuilder();

        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        xml.append("<booking>\n");
        xml.append("  <bookingId>").append(booking.getId()).append("</bookingId>\n");
        xml.append("  <status>").append(booking.getStatus()).append("</status>\n");
        xml.append("  <numberOfPeople>").append(booking.getNumberOfPeople()).append("</numberOfPeople>\n");
        xml.append("  <totalPrice>").append(booking.getTotalPrice()).append("</totalPrice>\n");
        xml.append("</booking>");

        try {
            FileWriter writer = new FileWriter("bookings/booking_" + booking.getId() + ".xml");
            writer.write(xml.toString());
            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}