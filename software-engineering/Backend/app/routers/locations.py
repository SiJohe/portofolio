from fastapi import APIRouter
import json

router = APIRouter(prefix="/api", tags=["Locations"])

@router.get("/locations")
def get_locations():
    with open("app/data/locations.json", "r", encoding="utf-8") as f:
        return json.load(f)
