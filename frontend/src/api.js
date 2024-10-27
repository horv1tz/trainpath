// src/api.js
const API_BASE_URL = "http://localhost:8000"; // Замените на реальный URL вашего API

async function apiRequest(path, method = 'GET', token = null, body = null) {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    
    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    try {
        const response = await fetch(`${API_BASE_URL}${path}`, options);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Ошибка запроса');
        }
        return await response.json();
    } catch (error) {
        console.error("API Request Error:", error);
        throw error;
    }
}

export const registerUser = (data) => apiRequest("/register", "POST", null, data);
export const loginUser = (data) => apiRequest("/login", "POST", null, data);
export const getAllTrains = (token) => apiRequest("/trains", "GET", token);
export const getTrainWagons = (trainId, token) => apiRequest(`/train/${trainId}/wagons`, "GET", token);
export const createOrder = (orderData, token) => apiRequest("/order", "POST", token, orderData);
export const getQueueStatus = () => apiRequest("/queue", "GET");
export const getOrderStatus = () => apiRequest("/order/status", "GET");
