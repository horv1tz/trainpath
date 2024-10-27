// src/api.js
import axios from 'axios';

const API_BASE_URL = "http://84.252.135.231/api";

// Создание экземпляра axios
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

// Регистрация пользователя
export const registerUser = async (userData) => {
    const response = await api.post("/register", userData);
    return response.data;
};

// Вход пользователя для получения токена
export const loginUser = async (authData) => {
    const response = await api.post("/login", authData);
    return response.data;
};

// Получение списка поездов
export const getAllTrains = async (token) => {
    const response = await api.get("/trains", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Получение вагонов конкретного поезда
export const getTrainWagons = async (trainId, token) => {
    const response = await api.get(`/train/${trainId}/wagons`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Создание заказа
export const createOrder = async (orderData, token) => {
    const response = await api.post("/order", orderData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Получение статуса очереди заказов
export const getOrderStatus = async (token) => {
    const response = await api.get("/order/status", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
