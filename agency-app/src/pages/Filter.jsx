import React, { useState } from 'react';
import {Box, TextField, MenuItem, Button, Chip, Stack, Typography} from '@mui/material';

const TripFilters = ({ categories, onFilter, onReset }) => {
    const [filters, setFilters] = useState({
        category: '',
        minPrice: '',
        maxPrice: '',
        destination: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter(filters);
    };

    const handleReset = () => {
        setFilters({
            category: '',
            minPrice: '',
            maxPrice: '',
            destination: ''
        });
        onReset();
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4, p: 3, border: '1px solid #eee', borderRadius: 1 }}>
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                <TextField
                    select
                    label="Category"
                    name="category"
                    value={filters.category}
                    onChange={handleChange}
                    sx={{ minWidth: 150 }}
                    size="small"
                >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map(category => (
                        <MenuItem key={category.id} value={category.id}>
                            {category.name}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    label="Min Price"
                    name="minPrice"
                    type="number"
                    value={filters.minPrice}
                    onChange={handleChange}
                    sx={{ width: 120 }}
                    size="small"
                    inputProps={{ min: 0 }}
                />

                <TextField
                    label="Max Price"
                    name="maxPrice"
                    type="number"
                    value={filters.maxPrice}
                    onChange={handleChange}
                    sx={{ width: 120 }}
                    size="small"
                    inputProps={{ min: 0 }}
                />

                <TextField
                    label="Destination"
                    name="destination"
                    value={filters.destination}
                    onChange={handleChange}
                    sx={{ minWidth: 180 }}
                    size="small"
                />

                <Button type="submit" variant="contained" size="medium">
                    Filter
                </Button>
                <Button onClick={handleReset} variant="outlined" size="medium">
                    Reset
                </Button>
            </Stack>

            {Object.values(filters).some(Boolean) && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Active filters:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        {filters.category && (
                            <Chip
                                label={`Category: ${categories.find(c => c.id === filters.category)?.name}`}
                                onDelete={() => setFilters(prev => ({ ...prev, category: '' }))}
                            />
                        )}
                        {filters.minPrice && (
                            <Chip
                                label={`Min price: $${filters.minPrice}`}
                                onDelete={() => setFilters(prev => ({ ...prev, minPrice: '' }))}
                            />
                        )}
                        {filters.maxPrice && (
                            <Chip
                                label={`Max price: $${filters.maxPrice}`}
                                onDelete={() => setFilters(prev => ({ ...prev, maxPrice: '' }))}
                            />
                        )}
                        {filters.destination && (
                            <Chip
                                label={`Destination: ${filters.destination}`}
                                onDelete={() => setFilters(prev => ({ ...prev, destination: '' }))}
                            />
                        )}
                    </Stack>
                </Box>
            )}
        </Box>
    );
};

export default TripFilters;