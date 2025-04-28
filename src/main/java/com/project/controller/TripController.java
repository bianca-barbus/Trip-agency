package com.project.controller;

import org.springframework.ui.Model;
import com.project.model.Trip;
import com.project.service.TripService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @GetMapping
    public ResponseEntity<List<Trip>> getAllTrips() {
        return ResponseEntity.ok(tripService.getAllTrips());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trip> getTripById(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.getTripById(id));
    }

    @PostMapping
    public ResponseEntity<Trip> createTrip(@RequestBody Trip trip) {
        return ResponseEntity.ok(tripService.addTrip(trip));
    }

    @GetMapping("/destination/{destination}")
    public ResponseEntity<List<Trip>> getTripsByDestination(@PathVariable String destination) {
        return ResponseEntity.ok(tripService.getTripsByDestination(destination));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Trip>> getUpcomingTrips() {
        return ResponseEntity.ok(tripService.getUpcomingTrips());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Trip> updateTrip(@PathVariable Long id, @RequestBody Trip trip) {
        // logic to update the trip
        Trip updatedTrip = tripService.updateTrip(id, trip);
        return ResponseEntity.ok(updatedTrip);
    }

    @GetMapping("/searchTrips")
    public String searchTrips(@RequestParam(required = false) String destination,
                              @RequestParam(required = false) String startDateStr,
                              @RequestParam(required = false) String endDateStr,
                              @RequestParam(required = false) Double maxPrice,
                              Model model) {

        LocalDate startDate = startDateStr != null ? LocalDate.parse(startDateStr) : null;
        LocalDate endDate = endDateStr != null ? LocalDate.parse(endDateStr) : null;

        List<Trip> trips = tripService.searchTrips(destination, startDate, endDate, maxPrice);

        model.addAttribute("trips", trips);
        return "tripSearchResults"; // The name of the view (HTML page)
    }

    @GetMapping("/trips")
    public List<Trip> getTrips(
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String category) {
        List<Trip> trips = tripService.getAllTrips();

        // Apply filters
        if (destination != null) {
            trips = trips.stream()
                    .filter(trip -> trip.getDestination().contains(destination))
                    .collect(Collectors.toList());
        }
        if (maxPrice != null) {
            trips = trips.stream()
                    .filter(trip -> trip.getPrice() <= maxPrice)
                    .collect(Collectors.toList());
        }
        if (category != null) {
            trips = trips.stream()
                    .filter(trip -> trip.getCategory() != null && trip.getCategory().getName().contains(category))
                    .collect(Collectors.toList());
        }
        return trips;
    }

}
