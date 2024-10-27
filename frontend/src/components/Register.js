// src/components/Register.js
import React, { useState } from 'react';
import { registerUser } from '../api';

function Register() {
    const [fio, setFio] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [team, setTeam] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser({ fio, email, password, team });
            setSuccess("Регистрация прошла успешно! Теперь вы можете войти.");
            setError('');
        } catch (err) {
            setError("Ошибка регистрации. Проверьте данные.");
            setSuccess('');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Регистрация</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="fio" className="block text-gray-700">ФИО</label>
                        <input
                            type="text"
                            id="fio"
                            value={fio}
                            onChange={(e) => setFio(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Введите ваше ФИО"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Введите ваш email"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-700">Пароль</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Введите ваш пароль"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="team" className="block text-gray-700">Команда</label>
                        <input
                            type="text"
                            id="team"
                            value={team}
                            onChange={(e) => setTeam(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Введите название вашей команды"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {success && <p className="text-green-500 text-center">{success}</p>}
                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition duration-200"
                    >
                        Зарегистрироваться
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;
