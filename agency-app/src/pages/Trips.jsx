import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import TripReviews from './TripReviews';
import api from '../services/api';

const Trips = () => {
    const [trips, setTrips] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [openBookingDialog, setOpenBookingDialog] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await api.get('/trips');
                setTrips(response.data);
            } catch (error) {
                console.error('Error fetching trips:', error);
            }
        };
        fetchTrips();
    }, []);

    const handleBookTrip = (trip) => {
        setSelectedTrip(trip);
        setOpenBookingDialog(true);
    };

    const confirmBooking = async () => {
        try {
            await api.post('/bookings', { tripId: selectedTrip.id });
            setNotification({ open: true, message: 'Trip booked successfully!', severity: 'success' });
            setOpenBookingDialog(false);
        } catch (error) {
            setNotification({ open: true, message: 'Booking failed', severity: 'error' });
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Available Trips</Typography>
            <Grid container spacing={4}>
                {trips.map((trip) => (
                    <Grid item key={trip.id} xs={12} sm={6} md={4}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="140"
                                image={trip.imageUrl || '/placeholder.jpg'}
                                alt={trip.name}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {trip.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {trip.destination} | {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                                </Typography>
                                <Typography variant="h6" sx={{ mt: 2 }}>
                                    ${trip.price}
                                </Typography>
                                <Button variant="contained" sx={{ mt: 2 }} onClick={() => handleBookTrip(trip)}>
                                    Book Now
                                </Button>
                            </CardContent>
                        </Card>
                        {/* Display reviews for each trip */}
                        <TripReviews tripId={trip.id} />
                    </Grid>
                ))}
            </Grid>

            {/* Confirm Booking Dialog */}
            <Dialog open={openBookingDialog} onClose={() => setOpenBookingDialog(false)}>
                <DialogTitle>Confirm Booking</DialogTitle>
                <DialogContent>
                    <Typography>You are booking: {selectedTrip?.name}</Typography>
                    <Typography>Price: ${selectedTrip?.price}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenBookingDialog(false)}>Cancel</Button>
                    <Button onClick={confirmBooking} variant="contained">Confirm</Button>
                </DialogActions>
            </Dialog>

            {/* Notification */}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={() => setNotification({ ...notification, open: false })}
            >
                <Alert severity={notification.severity}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Trips;
