// src/components/Profile.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Profile({ user, onLogout }) {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Профиль пользователя</h2>
                
                <div className="text-center space-y-4">
                    <div>
                        <p className="text-gray-600">Имя пользователя:</p>
                        <p className="text-lg font-semibold text-gray-800">{user?.fio || "Иван Иванов"}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Email:</p>
                        <p className="text-lg font-semibold text-gray-800">{user?.email || "ivan@example.com"}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Команда:</p>
                        <p className="text-lg font-semibold text-gray-800">{user?.team || "Team A"}</p>
                    </div>
                </div>

                <div className="flex flex-col items-center mt-6 space-y-4">
                    <button 
                        onClick={onLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 w-full"
                    >
                        Выйти
                    </button>
                    <button 
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 w-full"
                    >
                        Редактировать профиль
                    </button>
                    {/* Кнопка "На главную" */}
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200 w-full"
                    >
                        На главную
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;
