package com.project.repository;

import com.project.model.Trip;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TripRepository extends CrudRepository<Trip, Long> {
    List<Trip> findByDestination(String destination);
    List<Trip> findByStartDateAfter(LocalDate date);
    List<Trip> findByPriceLessThanEqual(Double maxPrice);

    @Query("SELECT t FROM Trip t WHERE t.category.id = :categoryId")
    List<Trip> findByCategoryId(@Param("categoryId") Long categoryId);

    @Query("SELECT t FROM Trip t WHERE " +
            "(:destination IS NULL OR t.destination LIKE %:destination%) AND " +
            "(:startDate IS NULL OR t.startDate >= :startDate) AND " +
            "(:endDate IS NULL OR t.startDate <= :endDate) AND " +
            "(:maxPrice IS NULL OR t.price <= :maxPrice)")
    List<Trip> searchTrips(@Param("destination") String destination,
                           @Param("startDate") LocalDate startDate,
                           @Param("endDate") LocalDate endDate,
                           @Param("maxPrice") Double maxPrice);
}

