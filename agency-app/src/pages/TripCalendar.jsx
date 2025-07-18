import React, { useEffect, useState } from 'react';
import {Calendar, momentLocalizer, Views} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import api from '../services/api';
import {
    Paper,
    Typography,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Box
} from '@mui/material';

// Proper way to update locale configuration
moment.updateLocale('en', {
    week: {
        dow: 1, // Monday as first day of week
    }
});

const localizer = momentLocalizer(moment);

const TripCalendar = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [view, setView] = useState(Views.WEEK);
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await api.get('/trips');
                const trips = response.data;

                const formattedEvents = trips.map(trip => ({
                    title: trip.name,
                    start: new Date(trip.startDate),
                    end: new Date(trip.endDate),
                    allDay: true,
                    description: trip.description,
                    id: trip.id,
                    destination: trip.destination,
                    price: trip.price
                }));
                setEvents(formattedEvents);
            } catch (error) {
                setError('Error fetching trips');
                console.error("Error fetching trips:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, []);

    const handleEventClick = (event) => {
        setSelectedEvent(event);
    };

    const handleCloseModal = () => {
        setSelectedEvent(null);
    };

    const eventStyleGetter = (event) => {
        const backgroundColor = '#3174ad';
        const style = {
            backgroundColor,
            borderRadius: '4px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block'
        };
        return { style };
    };

    return (
        <Paper sx={{
            mt: 4,
            p: 2,
            overflow: 'hidden'
        }}>
            <Typography variant="h6" gutterBottom>Trip Calendar</Typography>

            <Box sx={{
                height: 600,
                '& .rbc-toolbar': {
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                },
                '& .rbc-btn-group': {
                    display: 'flex',
                    gap: '8px'
                },
                '& .rbc-toolbar button': {
                    minWidth: '32px',
                    padding: '4px 8px',
                    border: '1px solid #ccc',
                    backgroundColor: '#fff',
                    color: '#333',
                    '&:hover': {
                        backgroundColor: '#eee'
                    },
                    '&:active': {
                        backgroundColor: '#ddd'
                    }
                },
                '& .rbc-toolbar button.rbc-active': {
                    backgroundColor: '#3174ad',
                    color: '#fff'
                }
            }}>
                {loading ? (
                    <CircularProgress />
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '100%' }}
                        onSelectEvent={handleEventClick}
                        eventPropGetter={eventStyleGetter}
                        defaultView="month"
                        views={[Views.MONTH, Views.WEEK, Views.DAY]}
                        view={view} // Include the view prop
                        date={date} // Include the date prop
                        onView={(view) => setView(view)}
                        onNavigate={(date) => {
                            setDate(new Date(date));
                        }}
                        components={{
                            event: ({ event }) => (
                                <div>
                                    <strong>{event.title}</strong>
                                    <div>{event.destination}</div>
                                </div>
                            )
                        }}
                    />
                )}
            </Box>

            <Dialog
                open={selectedEvent !== null}
                onClose={handleCloseModal}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>{selectedEvent?.title}</DialogTitle>
                <DialogContent>
                    <Typography variant="subtitle1" gutterBottom>
                        Destination: {selectedEvent?.destination}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        {selectedEvent?.description}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        <strong>Start:</strong> {selectedEvent?.start?.toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                        <strong>End:</strong> {selectedEvent?.end?.toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Price:</strong> ${selectedEvent?.price}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseModal}
                        color="primary"
                        variant="contained"
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default TripCalendar;