from pydantic import BaseModel
from datetime import datetime

class PredictResponse(BaseModel):
    id: int
    label: str
    confidence: float
    description: str
    recommendation: str
    image_path: str
    created_at: datetime
