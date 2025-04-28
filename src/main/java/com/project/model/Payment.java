package com.project.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Long id;

    @Column(nullable = false)
    private Double amount;

    @Column(name = "payment_date", nullable = false)
    private LocalDateTime paymentDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    @OneToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    public Payment(Long id, Double amount, LocalDateTime paymentDate, PaymentStatus paymentStatus){
        this.id = id;
        this.amount = amount;
        this.paymentDate = paymentDate;
        this.status = paymentStatus;
    }
}