from pydantic import BaseModel
from typing import Optional

class FeedbackIn(BaseModel):
    name: Optional[str] = ""
    rating: int
    message: str
    created_at: Optional[str] = None
