package com.project.controller;

import com.project.model.Review;
import com.project.model.Trip;
import com.project.model.User;
import com.project.repository.ReviewRepository;
import com.project.repository.TripRepository;
import com.project.repository.UserRepository;
import com.project.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final TripRepository tripRepository;

    public ReviewController(ReviewService reviewService, ReviewRepository reviewRepository,
                            UserRepository userRepository, TripRepository tripRepository) {
        this.reviewService = reviewService;
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.tripRepository = tripRepository;
    }

    @GetMapping("/{tripId}")
    public ResponseEntity<List<Review>> getReviewsForTrip(@PathVariable Long tripId) {
        return ResponseEntity.ok(reviewService.getReviewsForTrip(tripId));
    }

    @PostMapping
    public ResponseEntity<Review> addReview(@RequestBody Review review) {
        User user = userRepository.findById(review.getUser().getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Trip trip = tripRepository.findById(review.getTrip().getId())
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        review.setUser(user);
        review.setTrip(trip);

        Review savedReview = reviewRepository.save(review);
        return ResponseEntity.ok(savedReview);
    }
}
