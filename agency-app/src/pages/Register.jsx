import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '', email: '', userType: 'CLIENT' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users/register', formData);
            setSuccess(true);
            setTimeout(() => {
                navigate('/login', { state: { registrationSuccess: true } });
            }, 1500);
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
                    Create Account
                </Typography>

                {success && (
                    <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
                        Registration successful! Redirecting to login...
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
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Account Type</InputLabel>
                        <Select
                            name="userType"
                            value={formData.userType}
                            label="Account Type"
                            onChange={handleChange}
                        >
                            <MenuItem value="CLIENT">Client Account</MenuItem>
                            <MenuItem value="ADMIN">Admin Account</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{ mt: 3, mb: 2, py: 1.5 }}
                    >
                        Register
                    </Button>

                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Already have an account?{' '}
                        <Button
                            color="primary"
                            onClick={() => navigate('/login')}
                            sx={{ textTransform: 'none', fontWeight: 'bold' }}
                        >
                            Sign in
                        </Button>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default Register;
