# main.py

from fastapi import FastAPI
from database import models
from database.database import engine
from routers import items

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(items.router)
