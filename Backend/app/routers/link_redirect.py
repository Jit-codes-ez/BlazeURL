from fastapi import APIRouter, Depends
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.core.redis_cache import (
    get_temp_url,
    get_user_url,
    store_temp_url,
    store_user_url,
)
from app.models.temp_url import TempURL
from app.models.user_urls import UserURL

router = APIRouter(tags=["redirect"])


@router.get("/{short_code}")
def redirect_short_url(
    short_code: str,
    db: Session = Depends(get_db),
):
    # 1. Check USER URL cache first
    cached_user_url = get_user_url(short_code)

    if cached_user_url:
        return RedirectResponse(
            url=cached_user_url,
            status_code=307,
        )

    # 2. Check TEMP URL cache
    cached_temp_url = get_temp_url(short_code)

    if cached_temp_url:
        return RedirectResponse(
            url=cached_temp_url,
            status_code=307,
        )

    # 3. Redis miss → check USER URL database
    user_url = (
        db.query(UserURL)
        .filter(UserURL.short_code == short_code)
        .first()
    )

    if user_url:
        # Put it back into Redis
        store_user_url(
            short_code=user_url.short_code,
            original_url=user_url.original_url,
        )

        return RedirectResponse(
            url=user_url.original_url,
            status_code=307,
        )

    # 4. Redis miss → check TEMP URL database
    temp_url = (
        db.query(TempURL)
        .filter(TempURL.short_code == short_code)
        .first()
    )

    if temp_url:
        from datetime import datetime, timezone

        expires_at = temp_url.expires_at

        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)

        if expires_at <= datetime.now(timezone.utc):
            return RedirectResponse(
                url="/error410",
                status_code=307,
            )

        # Put it back into Redis
        remaining_seconds = int(
            (expires_at - datetime.now(timezone.utc)).total_seconds()
        )

        store_temp_url(
            short_code=temp_url.short_code,
            original_url=temp_url.original_url,
            ttl_seconds=remaining_seconds,
        )

        return RedirectResponse(
            url=temp_url.original_url,
            status_code=307,
        )

    # 5. Nothing found
    return RedirectResponse(
        url="/error404",
        status_code=307,
    )