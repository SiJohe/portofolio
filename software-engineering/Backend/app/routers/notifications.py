from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.notification_setting import NotificationSetting
from app.schemas.notification import NotificationSettingIn

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

@router.post("/settings")
def save_settings(payload: NotificationSettingIn, db: Session = Depends(get_db)):
    row = NotificationSetting(
        enabled=payload.enabled,
        time=payload.time,
        days=",".join(payload.days or []),
        type=payload.type,
        message=payload.message,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return {"status": "ok", "id": row.id}
