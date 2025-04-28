package com.project.service;

import com.project.model.Payment;
import com.project.model.PaymentStatus;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public interface PaymentService {
    Payment createPayment(Payment payment);
    Payment getPaymentById(Long paymentId);
    List<Payment> getPaymentsByStatus(PaymentStatus status);
    List<Payment> getAllPayments();
    List<Payment> getUserPayments(Long userId);
    Payment updatePaymentStatus(Long paymentId, PaymentStatus status);
    void processPayment(Long bookingId, Double amount);
}