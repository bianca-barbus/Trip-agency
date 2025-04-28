package com.project.service;

import com.project.model.Review;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface ReviewService {
    public List<Review> getReviewsForTrip(Long tripId);
    public Review createReview(Review review);
}
