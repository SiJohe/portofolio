from fastapi import APIRouter, UploadFile, File, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.prediction import Prediction
from app.ml.model_ai import model_service
from app.data.recommendations import RECOMMENDATIONS
from app.data.label_map import LABEL_MAP

import datetime, uuid, os, shutil

router = APIRouter(prefix="/predict", tags=["Prediction"])

@router.post("/")
def predict(
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user = Depends(get_current_user),   # 1. TAMBAH INI
):
    # =========================
    # Simpan file upload
    # =========================
    today = datetime.date.today().strftime("%Y-%m-%d")
    folder = f"static/uploads/{today}"
    os.makedirs(folder, exist_ok=True)

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".jpg", ".jpeg", ".png", ".webp"]:
        raise HTTPException(status_code=400, detail="Format file tidak didukung")

    filename = f"{uuid.uuid4().hex}{ext}"
    save_path = f"{folder}/{filename}"

    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # =========================
    # Predict AI
    # =========================
    label_en, confidence = model_service.predict(save_path)

    # =========================
    # Simpan ke DB (PENTING)
    # =========================
    new_pred = Prediction(
        label=label_en,
        confidence=confidence,
        image_path=save_path,
        user_id=user.id        # 2. SIMPAN USER_ID
    )
    db.add(new_pred)
    db.commit()
    db.refresh(new_pred)

    # =========================
    # Mapping ke frontend
    # =========================
    label_id = LABEL_MAP.get(label_en, label_en)
    description = RECOMMENDATIONS.get(
        label_en,
        f"Sampah ini diprediksi sebagai kategori {label_id}."
    )

    base = str(request.base_url).rstrip("/")
    image_url = f"{base}/{save_path}".replace("/static/static/", "/static/")

    return {
        "id": new_pred.id,
        "image": image_url,
        "label": label_id,
        "description": description,
        "confidence": confidence
    }
