import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, Typography, Card, CardContent, Snackbar, Alert } from '@mui/material';
import api from '../services/api';

const TripReviews = ({ tripId }) => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 1, comment: '' });
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await api.get(`/reviews/trip/${tripId}`);
                setReviews(response.data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchReviews();
    }, [tripId]);

    const handleSubmitReview = async () => {
        try {
            const reviewData = {
                tripId: tripId,
                rating: newReview.rating,
                comment: newReview.comment,
                userId: localStorage.getItem('userId') // Assuming user ID is stored in localStorage
            };
            const response = await api.post('/reviews', reviewData);
            setReviews([...reviews, response.data]);
            setNewReview({ rating: 1, comment: '' });
            showNotification('Review submitted successfully!', 'success');
        } catch (error) {
            showNotification('Error submitting review', 'error');
        }
    };

    const showNotification = (message, severity) => {
        setNotification({ open: true, message, severity });
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>Reviews</Typography>
            {reviews.length === 0 ? (
                <Typography>No reviews yet for this trip.</Typography>
            ) : (
                reviews.map((review) => (
                    <Card key={review.id} sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">Rating: {review.rating} / 5</Typography>
                            <Typography variant="body2" color="text.secondary">{review.comment}</Typography>
                        </CardContent>
                    </Card>
                ))
            )}

            <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>Submit Your Review</Typography>
                <TextField
                    label="Rating (1-5)"
                    type="number"
                    fullWidth
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: Math.max(1, Math.min(5, e.target.value)) })}
                    sx={{ mb: 2 }}
                    inputProps={{ min: 1, max: 5 }}
                />
                <TextField
                    label="Comment"
                    fullWidth
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    multiline
                    rows={4}
                    sx={{ mb: 2 }}
                />
                <Button variant="contained" onClick={handleSubmitReview}>Submit Review</Button>
            </Box>

            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={() => setNotification({ ...notification, open: false })}
            >
                <Alert severity={notification.severity}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default TripReviews;
