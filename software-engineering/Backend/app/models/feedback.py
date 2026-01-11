from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.core.database import Base

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(80), default="")
    rating = Column(Integer)
    message = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)
