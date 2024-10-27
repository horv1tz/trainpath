// src/components/TicketBookingPage.js
import React, { useState, useEffect } from 'react';
import { getAllTrains, getTrainWagons, createOrder } from '../api';

function TicketBookingPage({ token }) {
    const [trains, setTrains] = useState([]);
    const [selectedTrain, setSelectedTrain] = useState(null);
    const [wagons, setWagons] = useState([]);
    const [selectedWagon, setSelectedWagon] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const fetchTrains = async () => {
            try {
                const trainData = await getAllTrains(token);
                setTrains(trainData);
            } catch (error) {
                setStatus("Ошибка загрузки поездов");
            }
        };
        fetchTrains();
    }, [token]);

    const handleTrainSelect = async (trainId) => {
        setSelectedTrain(trainId);
        const wagonData = await getTrainWagons(trainId, token);
        setWagons(wagonData);
    };

    const toggleSeatSelection = (seatId) => {
        setSelectedSeats((prevSeats) =>
            prevSeats.includes(seatId) ? prevSeats.filter((id) => id !== seatId) : [...prevSeats, seatId]
        );
    };

    const handleCreateOrder = async () => {
        const orderData = { train_id: selectedTrain, wagon_id: selectedWagon, seat_ids: selectedSeats };
        try {
            const response = await createOrder(orderData, token);
            setStatus(`Заказ создан: ${response.order_id}`);
        } catch {
            setStatus("Ошибка создания заказа");
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header на всю ширину */}
            <header className="bg-orange-600 text-white py-5 shadow-md w-full">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
                    {/* Логотип и заголовок */}
                    <div className="flex items-center space-x-4">
                        <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center">
                            <span className="text-orange-600 font-bold">Лого</span>
                        </div>
                        <h1 className="text-3xl font-bold">ЖД Билеты</h1>
                    </div>

                    {/* Форма поиска */}
                    <div className="flex items-center space-x-4">
                        <input
                            type="text"
                            placeholder="Ростов-на-Дону"
                            className="p-3 rounded bg-white text-gray-800 w-48 shadow focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                            type="text"
                            placeholder="Москва"
                            className="p-3 rounded bg-white text-gray-800 w-48 shadow focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                            type="date"
                            className="p-3 rounded bg-white text-gray-800 w-48 shadow focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <select className="p-3 rounded bg-white text-gray-800 w-48 shadow focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option>1 пассажир Эконом</option>
                            <option>2 пассажира Эконом</option>
                        </select>
                        <button className="bg-purple-700 px-6 py-3 rounded font-semibold hover:bg-purple-800 transition duration-200">
                            Найти билеты
                        </button>
                        {/* Кнопка профиля */}
                        <button className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition duration-200">
                            Профиль
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto flex mt-6 px-4">
                {/* Боковая панель фильтров */}
                <aside className="w-1/4 p-4 bg-white rounded-lg shadow-md">
                    <h3 className="font-semibold mb-4">Сортировать</h3>
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input type="radio" name="sort" className="mr-2" /> Время отправления
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="sort" className="mr-2" /> Время прибытия
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="sort" className="mr-2" /> Время пути
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="sort" className="mr-2" /> Стоимость билетов
                        </label>
                    </div>

                    <h3 className="font-semibold mt-6 mb-2">Тип вагона</h3>
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" /> Купе
                        </label>
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" /> СВ
                        </label>
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" /> Плацкарт
                        </label>
                    </div>

                    <h3 className="font-semibold mt-6 mb-2">Места</h3>
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" /> Нижние
                        </label>
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" /> Верхние
                        </label>
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" /> Верхние боковые
                        </label>
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" /> Нижние боковые
                        </label>
                    </div>
                </aside>

                {/* Основной контент - список поездов */}
                <main className="flex-1 p-4 space-y-6">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">ЖД билеты на поезд Ростов-на-Дону → Москва</h2>
                    <div className="flex items-center space-x-4 mb-4">
                        <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100">Фирменный</button>
                        <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100">С питанием</button>
                        <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100">Двухэтажный</button>
                    </div>

                    {trains.map((train) => (
                        <div key={train.id} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-semibold text-purple-700">{train.name}</h3>
                                    <p className="text-gray-500">Номер поезда: {train.number}</p>
                                    <p className="text-gray-500">Отправление: 03:34 - Прибытие: 19:00</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-700">Плацкарт: от 4 932 ₽</p>
                                    <p className="text-gray-700">Купе: от 7 735 ₽</p>
                                    <p className="text-gray-700">СВ: от 25 572 ₽</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleTrainSelect(train.id)}
                                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Выбрать поезд
                            </button>
                        </div>
                    ))}

                    {/* Выбор вагонов и мест */}
                    {selectedTrain && wagons.length > 0 && (
                        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                            <h3 className="text-lg font-semibold mb-4">Выберите вагон и места</h3>
                            <div className="flex flex-wrap gap-4 mb-4">
                                {wagons.map((wagon) => (
                                    <button
                                        key={wagon.id}
                                        onClick={() => setSelectedWagon(wagon.id)}
                                        className={`p-3 rounded-lg ${selectedWagon === wagon.id ? 'bg-green-500 text-white' : 'bg-gray-100'
                                            } hover:bg-green-100`}
                                    >
                                        Вагон {wagon.name} - {wagon.type}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-5 gap-2 mb-4">
                                {[...Array(20)].map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => toggleSeatSelection(index + 1)}
                                        className={`p-2 rounded-lg ${selectedSeats.includes(index + 1) ? 'bg-yellow-500 text-white' : 'bg-gray-200'
                                            } hover:bg-yellow-100`}
                                    >
                                        Место {index + 1}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={handleCreateOrder}
                                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                            >
                                Далее
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default TicketBookingPage;
