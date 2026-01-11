from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.feedback import Feedback
from app.schemas.feedback import FeedbackIn

router = APIRouter(prefix="/api", tags=["Feedback"])

@router.post("/feedback")
def submit_feedback(payload: FeedbackIn, db: Session = Depends(get_db)):
    row = Feedback(
        name=payload.name or "",
        rating=int(payload.rating),
        message=payload.message.strip(),
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return {"status": "ok", "id": row.id}
