// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import TicketBookingPage from './components/TicketBookingPage';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';

function App() {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null); // Данные пользователя

    const handleLogout = () => {
        setToken(null);
        setUser(null);
    };

    return (
        <Router>
            {/* <div className="flex justify-center mt-8 space-x-4">
                {!token ? (
                    <>
                        <Link to="/login" className="text-blue-600 hover:underline">Вход</Link>
                        <Link to="/register" className="text-blue-600 hover:underline">Регистрация</Link>
                    </>
                ) : (
                    <>
                        <Link to="/" className="text-blue-600 hover:underline">На главную</Link>
                        <Link to="/profile" className="text-blue-600 hover:underline">Профиль</Link>
                        <Link to="/booking" className="text-blue-600 hover:underline">Бронирование</Link>
                    </>
                )}
            </div> */}
            <Routes>
                <Route path="/login" element={<Login setToken={setToken} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile user={user} onLogout={handleLogout} />} />
                <Route path="/booking" element={token ? <TicketBookingPage token={token} /> : <Login setToken={setToken} />} />
                <Route path="/" element={<TicketBookingPage token={token} />} />
            </Routes>
        </Router>
    );
}

export default App;
