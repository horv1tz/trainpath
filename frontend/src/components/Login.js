// src/components/Login.js
import React, { useState } from 'react';
import { loginUser } from '../api';

function Login({ setToken }) {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(formData);
            if (response.token) {
                setToken(response.token);
                setError(null);
            } else {
                setError("Не удалось получить токен");
            }
        } catch (error) {
            setError(`Ошибка входа: ${error.message}`);
        }
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-lg max-w-md mx-auto mt-6">
            <h2 className="text-2xl font-bold mb-4">Вход</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="password" name="password" placeholder="Пароль" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded" required />
                <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">Войти</button>
            </form>
            {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
    );
}

export default Login;
