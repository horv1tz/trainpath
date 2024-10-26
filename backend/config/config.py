# config/config.py

import os
from dotenv import load_dotenv

# Определяем путь к .env файлу
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_PATH = os.path.join(BASE_DIR, '.env')

# Загружаем переменные окружения из .env файла
load_dotenv(dotenv_path=ENV_PATH)

# Получаем URL базы данных из переменных окружения
DATABASE_URL = os.getenv("DATABASE_URL")
