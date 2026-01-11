import secrets
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User

router = APIRouter(tags=["Auth"])

@router.post("/register")
def register(data: dict, db: Session = Depends(get_db)):
    email = (data.get("email") or "").strip().lower()
    password_hash = data.get("password")  # sudah SHA-1 dari frontend
    name = (data.get("name") or "").strip()

    if not email or not password_hash:
        raise HTTPException(status_code=400, detail="Email & password wajib")

    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")

    user = User(name=name, email=email, password_hash=password_hash)
    db.add(user)
    db.commit()
    return {"message": "Register sukses"}

@router.post("/login")
def login(data: dict, db: Session = Depends(get_db)):
    email = (data.get("email") or "").strip().lower()
    password_hash = data.get("password")  # SHA-1 dari frontend

    user = db.query(User).filter(User.email == email).first()
    if not user or user.password_hash != password_hash:
        raise HTTPException(status_code=401, detail="Login gagal")

    token = secrets.token_hex(32)
    user.token = token
    db.commit()

    return {"token": token, "name": user.name}
