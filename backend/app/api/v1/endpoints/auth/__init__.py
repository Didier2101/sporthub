from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
import bcrypt
from datetime import datetime, timedelta

from jose import jwt

from app.db.session import get_db
from app.models.users.user_model import User
from app.core.config import settings

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        return JSONResponse(status_code=401, content={"message": "El email ingresado no está registrado"})
    
    input_pw = request.password.encode('utf-8')
    stored_pw = user.password.encode('utf-8')

    if not bcrypt.checkpw(input_pw, stored_pw):
        return JSONResponse(status_code=401, content={"message": "La contraseña es incorrecta"})

    payload = {
        'id': user.id,
        'role': user.role,
        'exp': datetime.utcnow() + timedelta(days=1)
    }
    
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

    response = JSONResponse(content={
        "message": "Inicio de sesión exitoso",
        "user": {
            "id": user.id,
            "email": user.email,
            "name_user": user.name_user,
            "fotoPerfil": user.urlphotoperfil
        },
        "token": token
    })
    
    response.set_cookie(
        key='liga_token',
        value=token,
        httponly=True,
        secure=True,
        samesite='strict',
        max_age=86400
    )

    return response

@router.get("/check-session")
def check_session(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("liga_token")
    if not token:
        return JSONResponse(status_code=401, content={"message": "No token provided"})
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = payload.get("id")
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return JSONResponse(status_code=401, content={"message": "User not found"})
            
        return {
            "authenticated": True,
            "user": {
                "id": user.id,
                "email": user.email,
                "name_user": user.name_user,
                "fotoPerfil": user.urlphotoperfil
            },
            "message": "Session valid"
        }
    except jwt.ExpiredSignatureError:
        return JSONResponse(status_code=401, content={"message": "Token expired"})
    except jwt.JWTError:
        return JSONResponse(status_code=401, content={"message": "Invalid token"})
