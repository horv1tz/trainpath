from fastapi import FastAPI, Depends, HTTPException, Header
from pydantic import BaseModel
from typing import List, Dict, Optional
import asyncio
import uuid
import logging
from datetime import datetime, timezone
import aiohttp

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("OrderService")

app = FastAPI()

class Settings:
    API_BASE_URL = "http://84.252.135.231/api"
    CHECK_INTERVAL = 10  # Интервал проверки очереди, сек.
    REQUEST_TIMEOUT = 10  # Таймаут для HTTP-запросов, сек.
    MAX_RETRIES = 3  # Количество повторных попыток запроса

settings = Settings()

# Модель данных для регистрации пользователя
class RegistrationRequest(BaseModel):
    fio: str
    email: str
    password: str
    team: str

# Модель данных для входа
class AuthRequest(BaseModel):
    email: str
    password: str

# Модель данных для создания заказа
class CreateOrderDTO(BaseModel):
    train_id: int
    wagon_id: int
    seat_ids: List[int]

# Модель элемента заказа
class OrderItem:
    def __init__(self, order_data: CreateOrderDTO, token: str):
        self.order_data = order_data
        self.token = token
        self.order_id = str(uuid.uuid4())
        self.created_at = datetime.now(timezone.utc)

# Класс для управления очередью и статусами заказов
class OrderManager:
    def __init__(self):
        self.queue: List[OrderItem] = []
        self.order_statuses: Dict[str, Dict[str, Optional[str]]] = {}
        self.lock = asyncio.Lock()

    async def add_to_queue(self, order_item: OrderItem):
        async with self.lock:
            self.queue.append(order_item)
            self.order_statuses[order_item.order_id] = {"status": "Queued", "error": None}
            logger.info(f"Заказ {order_item.order_id} добавлен в очередь.")

    async def update_status(self, order_id: str, status: str, error: Optional[str] = None):
        async with self.lock:
            self.order_statuses[order_id]["status"] = status
            self.order_statuses[order_id]["error"] = error
            logger.info(f"Статус заказа {order_id} обновлен: {status}")

    async def remove_from_queue(self, order_item: OrderItem):
        async with self.lock:
            if order_item in self.queue:
                self.queue.remove(order_item)
                logger.info(f"Заказ {order_item.order_id} удален из очереди.")

order_manager = OrderManager()

# Зависимость для получения токена из заголовков запроса
async def get_token_header(authorization: str = Header(...)) -> str:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=400, detail="Invalid token format")
    return authorization[len("Bearer "):]

# Глобальная сессия aiohttp
session: Optional[aiohttp.ClientSession] = None

# Функция для выполнения запросов с повторными попытками
async def make_request(
    method: str,
    url: str,
    retries: int = settings.MAX_RETRIES,
    **kwargs
) -> dict:
    for attempt in range(1, retries + 1):
        try:
            async with session.request(method, url, **kwargs) as response:
                if response.status >= 400:
                    text = await response.text()
                    logger.error(f"HTTP ошибка при попытке {attempt}/{retries} для {url}: {response.status} {text}")
                    if attempt == retries:
                        raise HTTPException(status_code=response.status, detail=text)
                else:
                    return await response.json()
        except aiohttp.ClientError as exc:
            logger.error(f"Ошибка запроса при попытке {attempt}/{retries} для {url}: {exc}")
            if attempt == retries:
                raise HTTPException(status_code=500, detail=str(exc))
            await asyncio.sleep(1)
    raise HTTPException(status_code=500, detail="Max retries exceeded")

# Фоновая задача для создания заказа
async def create_order_in_background(order_item: OrderItem):
    url = f"{settings.API_BASE_URL}/order"
    headers = {"Authorization": f"Bearer {order_item.token}"}
    try:
        await make_request(
            "POST",
            url,
            headers=headers,
            json=order_item.order_data.dict(),
        )
        await order_manager.update_status(order_item.order_id, "Success")
        logger.info(f"Заказ {order_item.order_id} успешно создан.")
    except Exception as e:
        await order_manager.update_status(order_item.order_id, "Failure", str(e))
        logger.error(f"Ошибка создания заказа {order_item.order_id}: {e}")

# Периодическая проверка доступности мест в очереди
async def check_queue_availability():
    while True:
        async with order_manager.lock:
            queue_copy = list(order_manager.queue)  # Копируем очередь для итерации

        tasks = [process_order_item(order_item) for order_item in queue_copy]
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)

        await asyncio.sleep(settings.CHECK_INTERVAL)

async def process_order_item(order_item: OrderItem):
    url = f"{settings.API_BASE_URL}/info/seats"
    params = {"wagonId": order_item.order_data.wagon_id}
    headers = {"Authorization": f"Bearer {order_item.token}"}
    try:
        seats_info = await make_request("GET", url, params=params, headers=headers)
        available_seats = [
            seat.get("seat_id") for seat in seats_info.get("seats", []) if seat.get("bookingStatus") == "FREE"
        ]

        if set(order_item.order_data.seat_ids).issubset(available_seats):
            await create_order_in_background(order_item)
            await order_manager.remove_from_queue(order_item)
    except Exception as e:
        logger.error(f"Ошибка при проверке мест для заказа {order_item.order_id}: {e}")

# Запуск фоновой задачи при старте приложения
@app.on_event("startup")
async def startup_event():
    global session
    timeout = aiohttp.ClientTimeout(total=settings.REQUEST_TIMEOUT)
    session = aiohttp.ClientSession(timeout=timeout)
    asyncio.create_task(check_queue_availability())
    logger.info("Приложение запущено и фоновые задачи стартовали.")

# Закрытие aiohttp-сессии при завершении приложения
@app.on_event("shutdown")
async def shutdown_event():
    await session.close()
    logger.info("Сессия aiohttp закрыта, приложение завершено.")

# Регистрация нового пользователя
@app.post("/register")
async def register(user_data: RegistrationRequest):
    url = f"{settings.API_BASE_URL}/auth/register"
    try:
        await make_request("POST", url, json=user_data.dict())
        logger.info(f"Пользователь {user_data.email} зарегистрирован.")
        return {"status": "registered"}
    except HTTPException as e:
        logger.error(f"Ошибка регистрации пользователя {user_data.email}: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"Ошибка регистрации пользователя {user_data.email}: {e}")
        raise HTTPException(status_code=500, detail="Ошибка регистрации")

# Вход для получения токена
@app.post("/login")
async def login(auth_data: AuthRequest):
    url = f"{settings.API_BASE_URL}/auth/login"
    try:
        response = await make_request("POST", url, json=auth_data.dict())
        token = response.get("token")
        if not token:
            logger.error("Токен не найден в ответе при входе пользователя.")
            raise HTTPException(status_code=500, detail="Token not found in response")
        logger.info(f"Пользователь {auth_data.email} вошел в систему.")
        return {"status": "logged in", "token": token}
    except HTTPException as e:
        logger.error(f"Ошибка входа пользователя {auth_data.email}: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"Ошибка входа пользователя {auth_data.email}: {e}")
        raise HTTPException(status_code=500, detail="Ошибка входа")

# Получение информации о всех доступных поездах
@app.get("/trains")
async def get_all_trains(token: str = Depends(get_token_header)):
    url = f"{settings.API_BASE_URL}/info/trains"
    headers = {"Authorization": f"Bearer {token}"}
    try:
        response = await make_request("GET", url, headers=headers)
        return response
    except HTTPException as e:
        logger.error(f"Ошибка получения данных о поездах: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"Ошибка получения данных о поездах: {e}")
        raise HTTPException(status_code=500, detail="Ошибка получения данных о поездах")

# Получение информации о вагонах конкретного поезда
@app.get("/train/{train_id}/wagons")
async def get_train_wagons(train_id: int, token: str = Depends(get_token_header)):
    url = f"{settings.API_BASE_URL}/info/wagons"
    params = {"trainId": train_id}
    headers = {"Authorization": f"Bearer {token}"}
    try:
        response = await make_request("GET", url, params=params, headers=headers)
        return response
    except HTTPException as e:
        logger.error(f"Ошибка получения данных о вагонах поезда {train_id}: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"Ошибка получения данных о вагонах поезда {train_id}: {e}")
        raise HTTPException(status_code=500, detail="Ошибка получения данных о вагонах")

# Создание заказа и добавление его в очередь
@app.post("/order")
async def create_order(order_data: CreateOrderDTO, token: str = Depends(get_token_header)):
    order_item = OrderItem(order_data, token)
    await order_manager.add_to_queue(order_item)
    return {"status": "order queued", "order_id": order_item.order_id}

# Получение текущего состояния очереди
@app.get("/queue")
async def get_queue():
    async with order_manager.lock:
        queue_data = [
            {
                "order_id": item.order_id,
                "created_at": item.created_at.isoformat(),
                **item.order_data.dict(),
            }
            for item in order_manager.queue
        ]
    return {"queue": queue_data}

# Получение статуса всех заказов
@app.get("/order/status")
async def get_order_status():
    async with order_manager.lock:
        statuses = order_manager.order_statuses.copy()
    return statuses
