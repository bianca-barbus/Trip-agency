import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
    FormControl, InputLabel, Select, MenuItem, CircularProgress, Grid, Paper, Stack, Table, TableHead, TableBody, TableRow, TableCell, Fab
} from '@mui/material';
import {jsPDF } from 'jspdf';
import {autoTable} from 'jspdf-autotable';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import Chat from './Chat.jsx'
import api from '../services/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [showUsers, setShowUsers] = useState(true);
    const [users, setUsers] = useState([]);
    const [trips, setTrips] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activityLogs, setActivityLogs] = useState([]);
    const [showActivityLogs, setShowActivityLogs] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

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
        fetchActivityLogs();
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

    const fetchActivityLogs = async () => {
        try {
            const response = await api.get('/users/activity-logs');
            setActivityLogs(response.data);
        } catch (error) {
            console.error("Error fetching activity logs:", error);
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

    const toggleActivityLogs = () => {
        setShowActivityLogs(!showActivityLogs);
    };

    const exportActivityLogsToPDF = () => {
        try {
            const doc = new jsPDF();

            const tableColumn = ["ID", "Username", "Role", "Action", "Timestamp"];
            const tableRows = activityLogs.map(log => [
                String(log.id || 'N/A'),
                String(log.username || 'N/A'),
                String(log.userType || 'N/A'),
                String(log.action || 'N/A'),
                log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'
            ]);

            doc.text("Activity Logs Report", 14, 15);

            autoTable(doc,{
                head: [tableColumn],
                body: tableRows,
                startY: 20,
                styles: {
                    overflow: 'linebreak',
                    cellPadding: 2,
                    fontSize: 8
                },
                columnStyles: {
                    0: { cellWidth: 15 },
                    4: { cellWidth: 30 }
                }
            });

            doc.save(`activity_logs_${new Date().toISOString().slice(0,10)}.pdf`);
        } catch (error) {
            console.error("PDF generation failed:", error);
            alert("Failed to generate PDF. Please check console for details.");
        }
    };


    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100vw',
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

                    <Grid container spacing={4} sx={{ mb: 3 }}>
                        <Grid item xs={4}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" color="primary">Total Users</Typography>
                                <Typography variant="h4">{users.length}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={4}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" color="primary">Total Trips</Typography>
                                <Typography variant="h4">{trips.length}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={4}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" color="primary">Activity Logs</Typography>
                                <Typography variant="h4">{activityLogs.length}</Typography>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* Toggle Button for Activity Logs */}
                    <Button
                        variant="outlined"
                        onClick={toggleActivityLogs}
                        sx={{ mt: 2, mb: 2 }}
                    >
                        {showActivityLogs ? 'Hide Activity Logs' : 'Show Activity Logs'}
                    </Button>

                    <Button variant="contained" color="secondary" onClick={() => exportActivityLogsToPDF()} sx={{ mb: 2 }}>
                        Export Logs as PDF
                    </Button>


                    {/* Show Activity Logs */}
                    {showActivityLogs && (
                        <Box sx={{ mt: 4, mb: 4 }}>
                            <Typography variant="h5" gutterBottom>Activity Logs</Typography>
                            {activityLogs.length > 0 ? (
                                <Paper sx={{ overflowX: 'auto' }}>
                                    <Table sx={{ minWidth: 650 }} aria-label="activity logs table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell><strong>ID</strong></TableCell>
                                                <TableCell><strong>Username</strong></TableCell>
                                                <TableCell><strong>Role</strong></TableCell>
                                                <TableCell><strong>Action</strong></TableCell>
                                                <TableCell><strong>Timestamp</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {activityLogs.map((log) => (
                                                <TableRow key={log.id}>
                                                    <TableCell>{log.id}</TableCell>
                                                    <TableCell>{log.username || 'N/A'}</TableCell>
                                                    <TableCell>{log.userType || 'N/A'}</TableCell>
                                                    <TableCell>{log.action || 'N/A'}</TableCell>
                                                    <TableCell>
                                                        {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Paper>
                            ) : (
                                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                                    No activity logs available
                                </Typography>
                            )}
                        </Box>
                    )}

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

                <Fab
                    color="primary"
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    sx={{
                        position: 'fixed',
                        bottom: 20,
                        right: 20,
                        zIndex: 1300,
                    }}
                >
                    {isChatOpen ? <CloseIcon /> : <ChatIcon />}
                </Fab>

                {isChatOpen && (
                    <Box
                        sx={{
                            position: 'fixed',
                            bottom: 80,
                            right: 20,
                            width: 320,
                            height: 420,
                            zIndex: 1200,
                            backgroundColor: 'white',
                            borderRadius: 2,
                            boxShadow: 3,
                            overflow: 'hidden',
                        }}
                    >
                        <Chat username="Admin" />
                    </Box>
                )}


            </Paper>
        </Box>
    );
};

export default AdminDashboard;
