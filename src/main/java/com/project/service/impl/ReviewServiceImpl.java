package com.project.service.impl;

import com.project.model.Review;
import com.project.repository.ReviewRepository;
import com.project.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    public List<Review> getReviewsForTrip(Long tripId) {
        return reviewRepository.findByTripId(tripId);
    }

    @Override
    public Review createReview(Review review) {
        return reviewRepository.save(review);
    }
}
