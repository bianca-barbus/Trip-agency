package com.project.repository;

import com.project.model.Booking;
import com.project.model.BookingStatus;
import com.project.model.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends CrudRepository<Booking, Long> {
    List<Booking> findByUser_UserId(Long userId);
    List<Booking> findByStatus(BookingStatus status);
}

