import React from 'react';
import { Box, Paper, Typography, Button, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Home = () => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100vw', // <<< FULL width
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
                    maxWidth: 500, // <<< Limit width of Paper, not Box
                    textAlign: 'center',
                    borderRadius: 4,
                    backgroundColor: 'white',
                }}
            >
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        color: '#1976d2',
                    }}
                >
                    Welcome
                </Typography>

                <Typography
                    variant="h6"
                    component="h2"
                    gutterBottom
                    sx={{ mb: 4, color: 'text.secondary' }}
                >
                    Discover amazing destinations around the world
                </Typography>

                <Stack spacing={2}>
                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        component={RouterLink}
                        to="/login"
                        sx={{ py: 1.5 }}
                    >
                        Login
                    </Button>

                    <Typography variant="body2" color="text.secondary">
                        Don't have an account?{' '}
                        <RouterLink
                            to="/register"
                            style={{
                                fontWeight: 'bold',
                                textDecoration: 'none',
                                color: '#1976d2',
                            }}
                        >
                            Register
                        </RouterLink>
                    </Typography>
                </Stack>

                <Typography
                    variant="caption"
                    sx={{ display: 'block', mt: 4, color: 'text.disabled' }}
                >
                    Start your journey with us today
                </Typography>
            </Paper>
        </Box>
    );
};

export default Home;
