from datetime import datetime, timedelta, timezone

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.config import settings
from app.models.temp_url import TempURL
from app.utils.shortcode import generate_unique_short_code


def create_temp_url(db: Session, original_url: str) -> TempURL:
    short_code = generate_unique_short_code(db)
    expires_at = datetime.now(timezone.utc) + timedelta(
        hours=settings.temp_url_expiry_hours
    )

    temp_url = TempURL(
        short_code=short_code,
        original_url=original_url,
        expires_at=expires_at,
    )

    db.add(temp_url)
    db.commit()
    db.refresh(temp_url)

    return temp_url


def get_active_temp_url(db: Session, short_code: str) -> TempURL:
    temp_url = db.query(TempURL).filter(TempURL.short_code == short_code).first()

    if not temp_url:
        raise HTTPException(status_code=404, detail="Link not found")

    expires_at = temp_url.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=410, detail="This link has expired")

    return temp_url


def register_click(db: Session, temp_url: TempURL) -> None:
    temp_url.click_count += 1
    db.commit()
