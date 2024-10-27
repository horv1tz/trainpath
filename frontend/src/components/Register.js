// src/components/Register.js
import React, { useState } from 'react';
import { registerUser } from '../api';

function Register() {
    const [formData, setFormData] = useState({ fio: '', email: '', password: '', team: '' });
    const [status, setStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await registerUser(formData);
            setStatus(`Пользователь зарегистрирован: ${response.status}`);
        } catch (error) {
            setStatus(`Ошибка регистрации: ${error.message}`);
        }
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Регистрация</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="fio" placeholder="ФИО" value={formData.fio} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="password" name="password" placeholder="Пароль" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="text" name="team" placeholder="Команда" value={formData.team} onChange={handleChange} className="w-full p-2 border rounded" required />
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Зарегистрироваться</button>
            </form>
            {status && <p className="mt-4 text-red-500">{status}</p>}
        </div>
    );
}

export default Register;
