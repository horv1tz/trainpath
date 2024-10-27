import unittest
import requests
import time

class TestOrderService(unittest.TestCase):
    BASE_URL = 'http://localhost:8001'
    user_data = {
        "fio": "Иванов Иван",
        "email": "testuser@example.com",
        "password": "testpassword",
        "team": "TestTeam"
    }
    auth_data = {
        "email": "testuser@example.com",
        "password": "testpassword"
    }
    token = None
    order_id = None

    def test_01_register_user(self):
        url = f"{self.BASE_URL}/register"
        response = requests.post(url, json=self.user_data)
        self.assertEqual(response.status_code, 200)
        self.assertIn("status", response.json())
        print("Регистрация пользователя:", response.json())

    def test_02_login_user(self):
        url = f"{self.BASE_URL}/login"
        response = requests.post(url, json=self.auth_data)
        self.assertEqual(response.status_code, 200)
        self.assertIn("token", response.json())
        self.token = response.json()["token"]
        print("Вход пользователя:", response.json())

    def test_03_get_trains(self):
        url = f"{self.BASE_URL}/trains"
        headers = {"Authorization": f"Bearer {self.token}"}
        response = requests.get(url, headers=headers)
        self.assertEqual(response.status_code, 200)
        trains = response.json()
        self.assertIsInstance(trains, list)
        self.train_id = trains[0].get("train_id")
        print("Список поездов:", trains)

    def test_04_create_order(self):
        url = f"{self.BASE_URL}/order"
        headers = {"Authorization": f"Bearer {self.token}"}
        order_data = {
            "train_id": self.train_id,
            "wagon_id": 1,  # Замените на реальный wagon_id
            "seat_ids": [1, 2]  # Замените на реальные seat_ids
        }
        response = requests.post(url, headers=headers, json=order_data)
        self.assertEqual(response.status_code, 200)
        self.assertIn("order_id", response.json())
        self.order_id = response.json()["order_id"]
        print("Создание заказа:", response.json())

    def test_05_check_order_status(self):
        print("Ожидание обработки заказа...")
        time.sleep(15)  # Ждем обработки заказа
        url = f"{self.BASE_URL}/order/status"
        response = requests.get(url)
        self.assertEqual(response.status_code, 200)
        statuses = response.json()
        self.assertIn(self.order_id, statuses)
        print(f"Статус заказа {self.order_id}:", statuses[self.order_id])

if __name__ == '__main__':
    unittest.main()
