from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.prediction import Prediction

router = APIRouter(
    prefix="/api/history",
    tags=["History"]
)

# =========================
# GET: ambil semua history user
# =========================
@router.get("")
def get_history(
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    rows = (
        db.query(Prediction)
        .filter(Prediction.user_id == user.id)
        .order_by(Prediction.created_at.desc())
        .all()
    )

    return [
        {
            "id": r.id,
            "label": r.label,
            "created_at": r.created_at,
            "image_url": r.image_path
        }
        for r in rows
    ]


# =========================
# DELETE: hapus 1 history
# =========================
@router.delete("/{pred_id}")
def delete_history_item(
    pred_id: int,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = (
        db.query(Prediction)
        .filter(
            Prediction.id == pred_id,
            Prediction.user_id == user.id
        )
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="History tidak ditemukan"
        )

    db.delete(item)
    db.commit()

    return {
        "message": "History berhasil dihapus",
        "id": pred_id
    }
