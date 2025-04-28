import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
    FormControl, InputLabel, Select, MenuItem, CircularProgress, Paper, Stack, Table, TableHead, TableBody, TableRow, TableCell
} from '@mui/material';
import api from '../services/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [showUsers, setShowUsers] = useState(true);
    const [users, setUsers] = useState([]);
    const [trips, setTrips] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [newTrip, setNewTrip] = useState({
        name: '', description: '', startDate: '', endDate: '', destination: '', price: '', categoryId: ''
    });

    useEffect(() => {
        fetchUsers();
        fetchTrips();
        fetchCategories();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchTrips = async () => {
        try {
            const response = await api.get('/trips');
            setTrips(response.data);
        } catch (error) {
            console.error("Error fetching trips:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleAddTrip = async () => {
        try {
            setLoading(true);
            await api.post('/trips', newTrip);
            fetchTrips();
            setOpenAddDialog(false);
        } catch (error) {
            console.error("Error adding trip:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTrip = async () => {
        try {
            setLoading(true);
            await api.put(`/trips/${selectedTrip.id}`, selectedTrip);
            fetchTrips();
            setOpenUpdateDialog(false);
        } catch (error) {
            console.error("Error updating trip:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            setLoading(true);
            await api.delete(`/users/${userId}`);
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    const toggleView = () => {
        setShowUsers(!showUsers);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100%',
                background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2,
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    p: 6,
                    width: '100%',
                    maxWidth: 1000,
                    borderRadius: 4,
                    backgroundColor: 'white',
                    textAlign: 'center',
                }}
            >
                <Stack spacing={3}>
                    <Button variant="outlined" onClick={handleBackToLogin} sx={{ alignSelf: 'flex-start' }}>
                        Back to Login
                    </Button>

                    <Typography variant="h4" fontWeight="bold" color="primary">
                        Admin Dashboard
                    </Typography>

                    <Button variant="contained" onClick={toggleView}>
                        {showUsers ? 'View Trips' : 'View Users'}
                    </Button>

                    {showUsers ? (
                        <>
                            <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>Users</Typography>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Username</TableCell>
                                        <TableCell>User Type</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map(user => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.id}</TableCell>
                                            <TableCell>{user.username}</TableCell>
                                            <TableCell>{user.userType}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => handleDeleteUser(user.userId)}
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </>
                    ) : (
                        <>
                            <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>Trips</Typography>
                            <Button variant="contained" onClick={() => setOpenAddDialog(true)} sx={{ mb: 2 }}>
                                Add Trip
                            </Button>
                            <Stack spacing={2}>
                                {trips.map(trip => (
                                    <Paper key={trip.id} elevation={2} sx={{ p: 2, textAlign: 'left' }}>
                                        <Typography variant="h6">{trip.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {trip.destination}
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            sx={{ mt: 1 }}
                                            onClick={() => {
                                                setSelectedTrip(trip);
                                                setOpenUpdateDialog(true);
                                            }}
                                        >
                                            Update
                                        </Button>
                                    </Paper>
                                ))}
                            </Stack>
                        </>
                    )}
                </Stack>

                {/* Dialogs */}
                <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} fullWidth>
                    <DialogTitle>Add Trip</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            {['name', 'description', 'startDate', 'endDate', 'destination', 'price'].map(field => (
                                <TextField
                                    key={field}
                                    type={field.includes('Date') ? 'date' : field === 'price' ? 'number' : 'text'}
                                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                                    value={newTrip[field]}
                                    onChange={(e) => setNewTrip({ ...newTrip, [field]: e.target.value })}
                                    fullWidth
                                />
                            ))}
                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={newTrip.categoryId}
                                    onChange={(e) => setNewTrip({ ...newTrip, categoryId: e.target.value })}
                                >
                                    {categories.map(category => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
                        <Button onClick={handleAddTrip} disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'Add'}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)} fullWidth>
                    <DialogTitle>Update Trip</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            {['name', 'description', 'startDate', 'endDate', 'destination', 'price'].map(field => (
                                <TextField
                                    key={field}
                                    type={field.includes('Date') ? 'date' : field === 'price' ? 'number' : 'text'}
                                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                                    value={selectedTrip?.[field] || ''}
                                    onChange={(e) => setSelectedTrip({ ...selectedTrip, [field]: e.target.value })}
                                    fullWidth
                                />
                            ))}
                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={selectedTrip?.category?.id || ''}
                                    onChange={(e) => setSelectedTrip({ ...selectedTrip, category: { id: e.target.value } })}
                                >
                                    {categories.map(category => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenUpdateDialog(false)}>Cancel</Button>
                        <Button onClick={handleUpdateTrip} disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'Update'}
                        </Button>
                    </DialogActions>
                </Dialog>

            </Paper>
        </Box>
    );
};

export default AdminDashboard;
