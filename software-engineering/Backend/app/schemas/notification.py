from pydantic import BaseModel
from typing import List

class NotificationSettingIn(BaseModel):
    enabled: bool
    time: str
    days: List[str]
    type: str
    message: str
