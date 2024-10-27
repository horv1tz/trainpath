// src/pages/Profile.js
import React from 'react';
import Register from '../components/Register';
import Login from '../components/Login';

function Profile({ token, setToken, onLogout }) {
    // Профиль, если пользователь авторизован
    if (token) {
        return (
            <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Профиль пользователя</h2>
                <p>Ваши данные отображаются здесь...</p>
                <button onClick={onLogout} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                    Выйти
                </button>
            </div>
        );
    }

    // Регистрация и вход, если пользователь не авторизован
    return (
        <div className="space-y-6 max-w-md mx-auto">
            <Register />
            <Login setToken={setToken} />
        </div>
    );
}

export default Profile;
