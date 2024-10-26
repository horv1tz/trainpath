from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, Session
from pydantic import BaseModel
from typing import List, Optional
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta

app = FastAPI(
    title="AxTrain",
    description="Axenix Train Service",
    version="1.0"
)

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Security
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "your_jwt_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Models
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    fio = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    team = Column(String)

class Train(Base):
    __tablename__ = "trains"
    id = Column(Integer, primary_key=True, index=True)
    global_route = Column(String)
    startpoint_departure = Column(String)
    endpoint_arrival = Column(String)
    available_seats_count = Column(Integer)

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    train_id = Column(Integer, ForeignKey("trains.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    seat_ids = Column(String)  # Stores seat IDs as a comma-separated string

Base.metadata.create_all(bind=engine)

# Schemas (DTOs)
class RegistrationRequest(BaseModel):
    fio: str
    email: str
    password: str
    team: str

class AuthResponse(BaseModel):
    token: str

class AuthRequest(BaseModel):
    email: str
    password: str

class CreateOrderDTO(BaseModel):
    train_id: int
    seat_ids: List[int]

class CreateOrderResponseDTO(BaseModel):
    order_id: int
    status: str

class TrainInfoDTO(BaseModel):
    train_id: int
    global_route: str
    startpoint_departure: str
    endpoint_arrival: str
    available_seats_count: int

# Utility functions
def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Routes
@app.post("/api/auth/register", response_model=AuthResponse, tags=["AuthController"])
def register_user(user: RegistrationRequest, db: Session = Depends(get_db)):
    hashed_password = get_password_hash(user.password)
    db_user = User(fio=user.fio, email=user.email, hashed_password=hashed_password, team=user.team)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    access_token = create_access_token(data={"sub": db_user.email})
    return {"token": access_token}

@app.post("/api/auth/login", response_model=AuthResponse, tags=["AuthController"])
def login_user(user: AuthRequest, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    access_token = create_access_token(data={"sub": db_user.email})
    return {"token": access_token}

@app.post("/api/order", response_model=CreateOrderResponseDTO, tags=["OrderController"], security=[{"bearerAuth": []}])
def create_order(order: CreateOrderDTO, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    # Decode token to get user info
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    email = payload.get("sub")
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="Unauthorized")

    # Save order
    seat_ids_str = ",".join(map(str, order.seat_ids))
    db_order = Order(train_id=order.train_id, user_id=user.id, seat_ids=seat_ids_str)
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return {"order_id": db_order.id, "status": "Success"}

@app.get("/api/info/trains", response_model=List[TrainInfoDTO], tags=["InfoController"], security=[{"bearerAuth": []}])
def get_all_trains(db: Session = Depends(get_db), booking_available: Optional[bool] = True):
    trains = db.query(Train).all()
    return [
        {"train_id": train.id, "global_route": train.global_route,
         "startpoint_departure": train.startpoint_departure, "endpoint_arrival": train.endpoint_arrival,
         "available_seats_count": train.available_seats_count} for train in trains
    ]
z