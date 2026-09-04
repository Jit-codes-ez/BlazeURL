import secrets
import string

from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.user_urls import UserURL
from app.schemas.user_urls import UserURLCreate
from app.core.redis_cache import (
    delete_user_url as delete_user_url_cache,
    get_user_url,
    store_user_url,
)


SHORT_CODE_LENGTH = 7
SHORT_CODE_ALPHABET = string.ascii_letters + string.digits


def generate_short_code(length: int = SHORT_CODE_LENGTH) -> str:
    return ''.join(
        secrets.choice(SHORT_CODE_ALPHABET)
        for _ in range(length)
    )


def generate_unique_short_code(db: Session) -> str:
    for _ in range(10):
        code = generate_short_code()

        existing = (
            db.query(UserURL.id)
            .filter(UserURL.short_code == code)
            .first()
        )

        if existing is None:
            return code

    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Could not generate a unique short URL.",
    )


def create_user_url(
    db: Session,
    user_id: UUID,
    data: UserURLCreate,
    base_url: str,
) -> UserURL:

    custom_alias = (
        data.custom_alias.strip()
        if data.custom_alias
        else None
    )

    title = (
        data.title.strip()
        if data.title
        else None
    )

    if custom_alias:
        existing = (
            db.query(UserURL.id)
            .filter(UserURL.custom_alias == custom_alias)
            .first()
        )

        if existing is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This custom alias is already taken.",
            )

        short_code = custom_alias

    else:
        short_code = generate_unique_short_code(db)

    if data.expires_at:
        expires_at = data.expires_at

        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)

        if expires_at <= datetime.now(timezone.utc):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Expiration time must be in the future.",
            )
    else:
        expires_at = None

    url = UserURL(
        user_id=user_id,
        original_url=str(data.original_url),
        short_code=short_code,
        custom_alias=custom_alias,
        title=title,
        expires_at=expires_at,
        qr_generated=data.make_qr,
        click_count=0,
    )

    db.add(url)
    db.commit()
    db.refresh(url)

    if url.expires_at:
        remaining_seconds = int(
            (url.expires_at - datetime.now(timezone.utc)).total_seconds()
        )

        store_user_url(
            short_code=url.short_code,
            original_url=url.original_url,
            ttl_seconds=remaining_seconds,
        )
    else:
        store_user_url(
            short_code=url.short_code,
            original_url=url.original_url,
        )

    return url


def get_active_user_url(
    db: Session,
    short_code: str,
) -> str:

    # 1. Check Redis first
    cached_url = get_user_url(short_code)

    if cached_url:
        return cached_url

    # 2. Redis miss → check database
    url = (
        db.query(UserURL)
        .filter(UserURL.short_code == short_code)
        .first()
    )

    # 3. URL doesn't exist anywhere
    if not url:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Link not found",
        )

    # 4. Check database expiration
    if url.expires_at:
        expires_at = url.expires_at

        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)

        now = datetime.now(timezone.utc)

        if expires_at <= now:
            delete_user_url_cache(short_code)

            db.delete(url)
            db.commit()

            raise HTTPException(
                status_code=status.HTTP_410_GONE,
                detail="This link has expired",
            )

        # 5. Redis miss + valid DB record → cache again
        remaining_seconds = int(
            (expires_at - now).total_seconds()
        )

        store_user_url(
            short_code=short_code,
            original_url=url.original_url,
            ttl_seconds=remaining_seconds,
        )

    else:
        # No expiration → cache again with normal TTL
        store_user_url(
            short_code=short_code,
            original_url=url.original_url,
        )

    # 6. Redirect
    return url.original_url

def get_user_urls(
    db: Session,
    user_id: UUID,
) -> tuple[list[UserURL], int]:

    urls = (
        db.query(UserURL)
        .filter(UserURL.user_id == user_id)
        .order_by(UserURL.created_at.desc())
        .all()
    )

    total = (
        db.query(func.count(UserURL.id))
        .filter(UserURL.user_id == user_id)
        .scalar()
    )

    return urls, total


def get_user_url(
    db: Session,
    user_id: UUID,
    url_id: UUID,
) -> UserURL:

    url = (
        db.query(UserURL)
        .filter(
            UserURL.id == url_id,
            UserURL.user_id == user_id,
        )
        .first()
    )

    if not url:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Short URL not found.",
        )

    return url


def delete_user_url(
    db: Session,
    user_id: UUID,
    url_id: UUID,
) -> None:

    url = (
        db.query(UserURL)
        .filter(
            UserURL.id == url_id,
            UserURL.user_id == user_id,
        )
        .first()
    )

    if not url:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Short URL not found.",
        )

    delete_user_url_cache(url.short_code)

    db.delete(url)
    db.commit()