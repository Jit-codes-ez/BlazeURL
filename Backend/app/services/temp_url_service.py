from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.config import settings
from app.core.redis_cache import (
    delete_temp_url,
    get_temp_url,
    store_temp_url,
)
from app.models.temp_url import TempURL
from app.utils.shortcode import generate_unique_short_code


def create_temp_url(db: Session, original_url: str) -> TempURL:
    short_code = generate_unique_short_code(db)
    expires_at = datetime.now(timezone.utc) + timedelta( hours=settings.temp_url_expiry_hours)
    temp_url = TempURL(short_code=short_code, original_url=original_url, expires_at=expires_at,)
    db.add(temp_url)
    db.commit()
    db.refresh(temp_url)
    store_temp_url(short_code=short_code, original_url=original_url, )

    return temp_url


def get_active_temp_url(db: Session, short_code: str) -> str:
    cached_url = get_temp_url(short_code)

    if cached_url:
        return cached_url

    temp_url = (db.query(TempURL).filter(TempURL.short_code == short_code).first())

    if not temp_url:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Link not found",
        )

    expires_at = temp_url.expires_at

    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    now = datetime.now(timezone.utc)

    if expires_at <= now:
        delete_temp_url(short_code)

        db.delete(temp_url)
        db.commit()
        raise HTTPException( status_code=status.HTTP_410_GONE, detail="This link has expired",)
    
    remaining_seconds = int((expires_at - now).total_seconds())
    cache_ttl = min(remaining_seconds,24 * 60 * 60,)
    store_temp_url(short_code=short_code,original_url=temp_url.original_url,ttl_seconds=cache_ttl,)

    return temp_url.original_url

def delete_expired_urls(db: Session):  #Only delete URLs that have been expired for more than 3 days
    cutoff = datetime.now(timezone.utc) - timedelta(days=3)
    db.query(TempURL).filter(TempURL.expires_at < cutoff).delete()
    db.commit()
