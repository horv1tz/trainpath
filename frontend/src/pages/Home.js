// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <h1 className="text-4xl font-bold text-gray-700 mb-6">Добро пожаловать на ЖД Билеты</h1>
            <p className="text-lg text-gray-600 mb-8 text-center max-w-lg">
                Здесь вы можете искать и бронировать билеты на поезда. Воспользуйтесь нашим удобным интерфейсом для поиска рейсов, выбора вагонов и бронирования мест.
            </p>
            <div className="space-x-4">
                <Link to="/profile">
                    <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                        Перейти в профиль
                    </button>
                </Link>
                <Link to="/booking">
                    <button className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700">
                        Найти билеты
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default Home;
