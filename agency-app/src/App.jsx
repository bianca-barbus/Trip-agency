// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Home from './pages/Home';
import Trips from './pages/Trips';
import Bookings from './pages/Bookings';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ClientDashboard from "./pages/ClientDashboard.jsx";

const theme = createTheme();

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/trips" element={<Trips />} />
                    <Route path="/bookings" element={<Bookings />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/client-dashboard" element={<ClientDashboard />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;