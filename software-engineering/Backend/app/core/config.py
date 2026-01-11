from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseModel):
    DB_URL: str = os.getenv("DB_URL")
    APP_NAME: str = os.getenv("APP_NAME", "KnowWaste Backend")

settings = Settings()
