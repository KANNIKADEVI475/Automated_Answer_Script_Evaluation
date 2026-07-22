from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from database import SessionLocal
from models import User

app = FastAPI()

# Allow React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Login(BaseModel):
    username: str
    password: str


@app.post("/login")
def login(data: Login):

    db = SessionLocal()

    user = db.query(User).filter(
        User.username == data.username,
        User.password == data.password
    ).first()

    db.close()

    if user:
        return {
            "success": True,
            "message": "Login Successful"
        }

    return {
        "success": False,
        "message": "Invalid Username or Password"
    }