package com.project.service;

import com.project.model.Trip;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
public interface TripService {
    Trip addTrip(Trip trip);
    List<Trip> getAllTrips();
    Trip getTripById(Long id);
    Trip updateTrip(Long tripId, Trip trip);
    void deleteTrip(Long id);
    List<Trip> getTripsByDestination(String destination);
    List<Trip> getUpcomingTrips();
    List<Trip> getTripsByCategory(Long categoryId);
    List<Trip> searchTrips(String destination, LocalDate startDate, LocalDate endDate, Double maxPrice);
}