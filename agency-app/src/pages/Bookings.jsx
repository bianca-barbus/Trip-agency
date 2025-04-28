import React, { useState, useEffect } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import api from '../services/api';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const bookingsResponse = await api.get(`/bookings/my-bookings?userId=${currentUser.id}`);
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        try {
            await api.delete(`/bookings/${bookingId}`);
            setNotification({ open: true, message: 'Booking cancelled successfully!', severity: 'success' });
            setBookings(bookings.filter(b => b.id !== bookingId));
        } catch (error) {
            setNotification({ open: true, message: 'Cancellation failed', severity: 'error' });
        }
    };

    const handleMakePayment = (booking) => {
        setSelectedBooking(booking);
        setPaymentAmount(booking.trip.price);
        setOpenPaymentDialog(true);
    };

    const confirmPayment = async () => {
        try {
            await api.post('/payments', {
                bookingId: selectedBooking.id,
                amount: paymentAmount
            });
            setNotification({ open: true, message: 'Payment successful!', severity: 'success' });
            setOpenPaymentDialog(false);
            fetchBookings(); // Refresh after payment
        } catch (error) {
            setNotification({ open: true, message: 'Payment failed', severity: 'error' });
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>My Bookings</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Trip</TableCell>
                            <TableCell>Destination</TableCell>
                            <TableCell>Dates</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings.map((booking) => (
                            <TableRow key={booking.id}>
                                <TableCell>{booking.trip.name}</TableCell>
                                <TableCell>{booking.trip.destination}</TableCell>
                                <TableCell>
                                    {new Date(booking.trip.startDate).toLocaleDateString()} - {new Date(booking.trip.endDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{booking.status}</TableCell>
                                <TableCell>
                                    <Button size="small" variant="outlined" color="error" onClick={() => handleCancelBooking(booking.id)}>
                                        Cancel
                                    </Button>
                                    {booking.status === 'PENDING' && (
                                        <Button size="small" variant="contained" sx={{ ml: 1 }} onClick={() => handleMakePayment(booking)}>
                                            Pay
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Payment Dialog */}
            <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)}>
                <DialogTitle>Make Payment</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>Trip: {selectedBooking?.trip.name}</Typography>
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

export default Bookings;
