import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, Paper } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/users/login', formData);
            localStorage.setItem('currentUser', JSON.stringify(response.data));
            if (response.data.userType === 'ADMIN') {
                navigate('/admin-dashboard');
            } else {
                navigate('/client-dashboard');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100vw',
                background: 'linear-gradient(to right, #74ebd5, #acb6e5)',
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
                    maxWidth: 500,
                    textAlign: 'center',
                    borderRadius: 4,
                    backgroundColor: 'white',
                }}
            >
                <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#1976d2' }}>
                    Sign In
                </Typography>

                {location.state?.registrationSuccess && (
                    <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
                        Registration successful! Please login.
                    </Alert>
                )}

                {error && (
                    <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Username"
                        autoFocus
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{ mt: 3, mb: 2, py: 1.5 }}
                    >
                        Sign In
                    </Button>

                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Don't have an account?{' '}
                        <Button
                            color="primary"
                            onClick={() => navigate('/register')}
                            sx={{ textTransform: 'none', fontWeight: 'bold' }}
                        >
                            Register here
                        </Button>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default Login;
