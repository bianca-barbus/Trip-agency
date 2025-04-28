package com.project.service.impl;

import com.project.model.Booking;
import com.project.model.BookingStatus;
import com.project.model.Payment;
import com.project.model.PaymentStatus;
import com.project.repository.BookingRepository;
import com.project.repository.PaymentRepository;
import com.project.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentServiceImpl implements PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public Payment createPayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    @Override
    public Payment getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId).orElse(null);
    }

    @Override
    public List<Payment> getUserPayments(Long userId) {
        return paymentRepository.findByBookingUser_Id(userId);
    }

    @Override
    public List<Payment> getPaymentsByStatus(PaymentStatus status){ return paymentRepository.findByStatus(status);}

    @Override
    public Payment updatePaymentStatus(Long paymentId, PaymentStatus status) {
        return paymentRepository.findById(paymentId)
                .map(payment -> {
                    payment.setStatus(status);
                    return paymentRepository.save(payment);
                })
                .orElse(null);
    }


    @Override
    public void processPayment(Long bookingId, Double amount) {
        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking != null) {
            Payment payment = new Payment();
            payment.setAmount(amount);
            payment.setPaymentDate(LocalDateTime.now());
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setBooking(booking);
            paymentRepository.save(payment);

            booking.setStatus(BookingStatus.CONFIRMED);
            bookingRepository.save(booking);
        }
    }

    @Override
    public List<Payment> getAllPayments() {
        return (List<Payment>) paymentRepository.findAll();
    }

}