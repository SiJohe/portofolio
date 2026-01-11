from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from datetime import datetime
from app.core.database import Base

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)  
    label = Column(String(50))
    confidence = Column(Float)
    image_path = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
