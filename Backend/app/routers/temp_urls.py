from fastapi import APIRouter, Depends
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.schemas.temp_url import ShortenRequest, ShortenResponse
from app.services import temp_url_service

router = APIRouter(tags=["temp-urls"])


@router.post("/api/shorten", response_model=ShortenResponse)
def shorten_url(payload: ShortenRequest, db: Session = Depends(get_db)):
    temp_url = temp_url_service.create_temp_url(db, str(payload.original_url))

    return ShortenResponse(
        short_url=f"{settings.backend_base_url}/{temp_url.short_code}",
        short_code=temp_url.short_code,
        original_url=temp_url.original_url,
        expires_at=temp_url.expires_at,
    )


@router.get("/{short_code}")
def redirect_short_url(short_code: str, db: Session = Depends(get_db)):
    temp_url = temp_url_service.get_active_temp_url(db, short_code)
    temp_url_service.register_click(db, temp_url)
    return RedirectResponse(url=temp_url.original_url, status_code=307)
