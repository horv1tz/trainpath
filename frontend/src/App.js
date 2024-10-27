// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import TicketBookingPage from './components/TicketBookingPage';

function App() {
    const [token, setToken] = useState(null);

    const handleLogout = () => {
        setToken(null);
    };

    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route
                        path="/profile"
                        element={<Profile token={token} setToken={setToken} onLogout={handleLogout} />}
                    />
                    <Route path="/booking" element={<TicketBookingPage token={token} />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
