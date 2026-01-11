from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from app.core.database import Base

class NotificationSetting(Base):
    __tablename__ = "notification_settings"

    id = Column(Integer, primary_key=True, index=True)
    enabled = Column(Boolean, default=False)
    time = Column(String(10), default="20:00")
    days = Column(String(64), default="")  # simpan "mon,tue,wed"
    type = Column(String(32), default="sort_waste")
    message = Column(String(255), default="")
    created_at = Column(DateTime, default=datetime.utcnow)
