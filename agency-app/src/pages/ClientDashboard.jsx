import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Button, Box, Grid, Card, CardContent,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Snackbar, Alert, Paper, Rating, Stack
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import TripFilters from './Filter';
import api from '../services/api';

const ClientDashboard = () => {
    const [activeTab, setActiveTab] = useState('trips');
    const [trips, setTrips] = useState([]);
    const [filteredTrips, setFilteredTrips] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [selectedTripId, setSelectedTripId] = useState(null);
    const [selectedNumberOfPeople, setSelectedNumberOfPeople] = useState(1);
    const [openBookingDialog, setOpenBookingDialog] = useState(false);
    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
    const [reviewsDialogOpen, setReviewsDialogOpen] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState('');
    const [newRating, setNewRating] = useState(5);
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserAndData = async () => {
            try {
                const userFromStorage = localStorage.getItem('currentUser');
                if (userFromStorage) {
                    const parsedUser = JSON.parse(userFromStorage);
                    setCurrentUser(parsedUser);

                    if (activeTab === 'trips') {
                        const [tripsResponse, categoriesResponse] = await Promise.all([
                            api.get('/trips'),
                            api.get('/categories')
                        ]);
                        setTrips(tripsResponse.data);
                        setFilteredTrips(tripsResponse.data);
                        setCategories(categoriesResponse.data);
                    } else if (activeTab === 'bookings') {
                        const bookingsResponse = await api.get(`/bookings/my-bookings?userId=${parsedUser.id}`);
                        setBookings(bookingsResponse.data);
                    }
                } else {
                    showNotification('Please login to access this page', 'error');
                    navigate('/login');
                }
            } catch (error) {
                showNotification('Please login to access this page', 'error');
                navigate('/login');
            }
        };

        fetchUserAndData();
    }, [activeTab, navigate]);

    const showNotification = (message, severity) => {
        setNotification({ open: true, message, severity });
    };

    const handleFilter = (filters) => {
        let results = [...trips];
        if (filters.category) results = results.filter(trip => trip.category === filters.category);
        if (filters.minPrice) results = results.filter(trip => trip.price >= Number(filters.minPrice));
        if (filters.maxPrice) results = results.filter(trip => trip.price <= Number(filters.maxPrice));
        if (filters.destination) results = results.filter(trip =>
            trip.destination.toLowerCase().includes(filters.destination.toLowerCase())
        );
        setFilteredTrips(results);
    };

    const handleResetFilters = () => {
        setFilteredTrips([...trips]);
    };

    const handleBookTrip = (trip) => {
        setSelectedTrip(trip);
        setOpenBookingDialog(true);
    };

    const confirmBooking = async () => {
        try {
            const bookingData = {
                numberOfPeople: selectedNumberOfPeople,
                totalPrice: selectedTrip.price * selectedNumberOfPeople,
                status: 'PENDING',
                tripId: selectedTrip.id,
                userId: currentUser.userId
            };

            await api.post('/bookings', bookingData);
            showNotification('Booking confirmed!', 'success');
            setOpenBookingDialog(false);
            if (activeTab === 'bookings') {
                const bookingsResponse = await api.get(`/bookings/my-bookings?userId=${currentUser.id}`);
                setBookings(bookingsResponse.data);
            }
        } catch (error) {
            showNotification(error.response?.data?.message || 'Booking failed', 'error');
        }
    };

    const handleCancelBooking = async (bookingId) => {
        try {
            await api.delete(`/bookings/${bookingId}`);
            showNotification('Booking cancelled successfully!', 'success');
            setBookings(bookings.filter(b => b.id !== bookingId));
        } catch (error) {
            showNotification('Cancellation failed', 'error');
        }
    };

    const handleMakePayment = (booking) => {
        setSelectedTrip(booking.trip);
        setPaymentAmount(booking.trip.price);
        setOpenPaymentDialog(true);
    };

    const confirmPayment = async () => {
        try {
            await api.post('/payments', {
                bookingId: bookings.find(b => b.trip.id === selectedTrip.id).id,
                amount: paymentAmount
            });
            showNotification('Payment successful!', 'success');
            setOpenPaymentDialog(false);
            const bookingsResponse = await api.get(`/bookings/my-bookings?userId=${currentUser.id}`);
            setBookings(bookingsResponse.data);
        } catch (error) {
            showNotification('Payment failed', 'error');
        }
    };

    const handleOpenReviewsDialog = (tripId) => {
        setSelectedTripId(tripId);
        fetchReviews(tripId);
        setReviewsDialogOpen(true);
    };

    const handleCloseReviewsDialog = () => {
        setReviewsDialogOpen(false);
        setNewReview('');
        setNewRating(5);
    };

    const fetchReviews = async (tripId) => {
        try {
            const response = await api.get(`/reviews/${tripId}`);
            setReviews(response.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleAddReview = async () => {
        if (newReview.trim() === "" || newRating === 0) {
            showNotification("Please provide a review and select a rating.", "error");
            return;
        }

        try {
            const reviewData = {
                trip: { id: selectedTripId },
                user: { userId: currentUser.userId },
                rating: newRating,
                comment: newReview
            };

            const response = await api.post('/reviews', reviewData);
            setReviews([...reviews, response.data]);
            setNewReview('');
            setNewRating(5);
            showNotification('Review added successfully!', 'success');
        } catch (error) {
            showNotification('Failed to add review', 'error');
        }
    };

    // Dialogs
    const renderBookingDialog = () => (
        <Dialog open={openBookingDialog} onClose={() => setOpenBookingDialog(false)} fullWidth maxWidth="sm">
            <DialogTitle>Confirm Booking</DialogTitle>
            <DialogContent>
                <Typography variant="h6">{selectedTrip?.name}</Typography>
                <Typography>Destination: {selectedTrip?.destination}</Typography>
                <Typography>
                    Dates: {new Date(selectedTrip?.startDate).toLocaleDateString()} - {new Date(selectedTrip?.endDate).toLocaleDateString()}
                </Typography>
                <TextField
                    label="Number of People"
                    type="number"
                    fullWidth
                    value={selectedNumberOfPeople}
                    onChange={(e) => {
                        const value = Math.max(1, parseInt(e.target.value)) || 1;
                        setSelectedNumberOfPeople(value);
                    }}
                    inputProps={{ min: 1 }}
                    sx={{ mt: 2 }}
                />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Total: ${(selectedTrip ? (selectedTrip.price * selectedNumberOfPeople) : 0).toFixed(2)}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenBookingDialog(false)}>Cancel</Button>
                <Button onClick={confirmBooking} variant="contained" color="primary">Confirm</Button>
            </DialogActions>
        </Dialog>
    );

    const renderPaymentDialog = () => (
        <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)} fullWidth maxWidth="sm">
            <DialogTitle>Make Payment</DialogTitle>
            <DialogContent>
                <Typography variant="h6">{selectedTrip?.name}</Typography>
                <TextField
                    label="Amount"
                    type="number"
                    fullWidth
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    sx={{ mt: 2 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenPaymentDialog(false)}>Cancel</Button>
                <Button onClick={confirmPayment} variant="contained">Pay Now</Button>
            </DialogActions>
        </Dialog>
    );

    const renderReviewsDialog = () => (
        <Dialog open={reviewsDialogOpen} onClose={handleCloseReviewsDialog} fullWidth maxWidth="sm">
            <DialogTitle>Trip Reviews</DialogTitle>
            <DialogContent dividers>
                {reviews.length === 0 ? (
                    <Typography>No reviews yet. Be the first to review!</Typography>
                ) : (
                    <Box sx={{ maxHeight: 300, overflowY: 'auto', my: 2 }}>
                        {reviews.map(review => (
                            <Box key={review.id} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {review.user?.username || 'Anonymous'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </Typography>
                                <Rating value={review.rating} readOnly size="small" sx={{ mt: 1 }} />
                                <Typography variant="body1" sx={{ mt: 1 }}>{review.comment}</Typography>
                            </Box>
                        ))}
                    </Box>
                )}

                {/* New review form */}
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6">Add Your Review</Typography>
                    <Rating
                        name="new-rating"
                        value={newRating}
                        onChange={(event, newValue) => setNewRating(newValue)}
                        size="large"
                        sx={{ mt: 1 }}
                    />
                    <TextField
                        label="Write your review"
                        multiline
                        rows={4}
                        fullWidth
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseReviewsDialog}>Close</Button>
                <Button
                    onClick={handleAddReview}
                    variant="contained"
                    disabled={!newReview.trim() || newRating === 0}
                >
                    Submit Review
                </Button>
            </DialogActions>
        </Dialog>
    );


    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100vw',
                background: 'linear-gradient(to right, #74ebd5, #acb6e5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    p: 4,
                    width: '100%',
                    maxWidth: 1200,
                    minHeight: '80vh',
                    borderRadius: 4,
                    backgroundColor: 'white',
                    overflowY: 'auto'
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="outlined" onClick={() => navigate('/login')}>Back to Login</Button>
                </Box>

                <Typography variant="h4" align="center" sx={{ my: 4, fontWeight: 'bold', color: '#1976d2' }}>
                    Client Dashboard
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
                    <Button
                        variant={activeTab === 'trips' ? 'contained' : 'outlined'}
                        onClick={() => setActiveTab('trips')}
                    >
                        Browse Trips
                    </Button>
                    <Button
                        variant={activeTab === 'bookings' ? 'contained' : 'outlined'}
                        onClick={() => setActiveTab('bookings')}
                    >
                        My Bookings
                    </Button>
                </Box>

                {activeTab === 'trips' ? (
                    <>
                        <TripFilters categories={categories} onFilter={handleFilter} onReset={handleResetFilters} />
                        <Grid container spacing={3}>
                            {filteredTrips.map(trip => (
                                <Grid item xs={12} sm={6} md={4} key={trip.id}>
                                    <Card sx={{ p: 2 }}>
                                        <CardContent>
                                            <Typography variant="h6">{trip.name}</Typography>
                                            <Typography color="text.secondary">{trip.destination}</Typography>
                                            <Typography sx={{ my: 1 }}>${trip.price}</Typography>
                                            <Typography variant="body2">
                                                {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                                            </Typography>
                                            <Stack spacing={1} sx={{ mt: 2 }}>
                                                <Button variant="contained" fullWidth onClick={() => handleBookTrip(trip)}>Book Now</Button>
                                                <Button variant="outlined" fullWidth onClick={() => handleOpenReviewsDialog(trip.id)}>View Reviews</Button>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </>
                ) : (
                    <Grid container spacing={3}>
                        {bookings.map(booking => (
                            <Grid item xs={12} sm={6} md={4} key={booking.id}>
                                <Card sx={{ p: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6">{booking.trip.name}</Typography>
                                        <Typography>Status: {booking.status}</Typography>
                                        <Typography sx={{ my: 1 }}>Amount: ${booking.trip.price}</Typography>
                                        <Stack spacing={1} sx={{ mt: 2 }}>
                                            {booking.status === 'PENDING' && (
                                                <Button variant="contained" onClick={() => handleMakePayment(booking)}>Make Payment</Button>
                                            )}
                                            <Button variant="outlined" color="error" onClick={() => handleCancelBooking(booking.id)}>Cancel</Button>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Reviews Dialog */}
                <Dialog open={reviewsDialogOpen} onClose={handleCloseReviewsDialog} fullWidth maxWidth="sm">
                    <DialogTitle>Trip Reviews</DialogTitle>
                    <DialogContent>
                        <Box sx={{ maxHeight: 300, overflowY: 'auto', my: 2 }}>
                            {reviews.length > 0 ? reviews.map(review => (
                                <Box key={review.id} sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2">{review.user?.username || 'Anonymous'}</Typography>
                                    <Rating value={review.rating} readOnly size="small" />
                                    <Typography variant="body2" sx={{ mt: 1 }}>{review.comment}</Typography>
                                </Box>
                            )) : (
                                <Typography>No reviews yet. Be the first to review!</Typography>
                            )}
                        </Box>
                        <TextField
                            label="Add your review"
                            multiline
                            rows={3}
                            fullWidth
                            value={newReview}
                            onChange={(e) => setNewReview(e.target.value)}
                            sx={{ mt: 2 }}
                        />
                        <Rating
                            value={newRating}
                            onChange={(e, newValue) => setNewRating(newValue)}
                            size="large"
                            sx={{ mt: 2 }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseReviewsDialog}>Close</Button>
                        <Button onClick={handleAddReview} variant="contained" disabled={!newReview.trim()}>
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Dialogs and Notification Snackbar */}
                {renderBookingDialog()}
                {renderPaymentDialog()}
                {renderReviewsDialog()}

                {/* Snackbar */}
                <Snackbar open={notification.open} autoHideDuration={6000} onClose={() => setNotification({ ...notification, open: false })}>
                    <Alert severity={notification.severity}>{notification.message}</Alert>
                </Snackbar>
            </Paper>
        </Box>
    );
};

export default ClientDashboard;
