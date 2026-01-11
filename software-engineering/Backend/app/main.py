from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.database import Base, engine
from app.routers import predict, history, locations, notifications, feedback, user, auth

Base.metadata.create_all(bind=engine)

app = FastAPI(title="KnowWaste Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# static supaya /static/uploads/... bisa diakses
app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(predict.router)
app.include_router(history.router)
app.include_router(locations.router)
app.include_router(notifications.router)
app.include_router(feedback.router)
app.include_router(user.router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "KnowWaste API is running"}


# Jalanin backend
# uvicorn app.main:app --reload