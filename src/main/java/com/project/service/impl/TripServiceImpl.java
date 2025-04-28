package com.project.service.impl;

import com.project.model.Category;
import com.project.model.Trip;
import com.project.repository.CategoryRepository;
import com.project.repository.TripRepository;
import com.project.service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class TripServiceImpl implements TripService {
    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public Trip addTrip(Trip trip) {
        // Check if the category exists by its ID
        if (trip.getCategory() != null && trip.getCategory().getId() != null) {
            // You can fetch the category from the repository using its ID (if not already set)
            Optional<Category> category = categoryRepository.findById(trip.getCategory().getId());
            if (category.isPresent()) {
                trip.setCategory(category.get());
            } else {
                throw new RuntimeException("Category not found!");
            }
        }
        return tripRepository.save(trip);
    }


    @Override
    public List<Trip> getAllTrips() {
        return (List<Trip>) tripRepository.findAll();
    }

    @Override
    public Trip getTripById(Long id) {
        return tripRepository.findById(id).orElse(null);
    }

    @Override
    public Trip updateTrip(Long tripId, Trip trip) {
        Optional<Trip> checkExistingTrip = tripRepository.findById(tripId);
        if (checkExistingTrip.isPresent()) {
            Trip currentTrip = checkExistingTrip.get();
            currentTrip.setName(trip.getName());
            currentTrip.setDescription(trip.getDescription());
            currentTrip.setStartDate(trip.getStartDate());
            currentTrip.setEndDate(trip.getEndDate());
            currentTrip.setDestination(trip.getDestination());
            currentTrip.setPrice(trip.getPrice());
            if (trip.getCategory() != null && trip.getCategory().getId() != null) {
                Optional<Category> category = categoryRepository.findById(trip.getCategory().getId());
                if (category.isPresent()) {
                    currentTrip.setCategory(category.get());
                } else {
                    throw new RuntimeException("Category not found!");
                }
            }
            return tripRepository.save(currentTrip);
        }
        return null;
    }

    @Override
    public void deleteTrip(Long id) {
        tripRepository.deleteById(id);
    }

    @Override
    public List<Trip> getTripsByDestination(String destination) {
        return tripRepository.findByDestination(destination);
    }

    @Override
    public List<Trip> getUpcomingTrips() {
        return tripRepository.findByStartDateAfter(LocalDate.now());
    }

    @Override
    public List<Trip> getTripsByCategory(Long categoryId) {
        return tripRepository.findByCategoryId(categoryId);
    }

    @Override
    public List<Trip> searchTrips(String destination, LocalDate startDate, LocalDate endDate, Double maxPrice) {
        return tripRepository.searchTrips(destination, startDate, endDate, maxPrice);
    }
}