from uuid import UUID

from sqlalchemy.orm import Session

from app.core.redis_cache import delete_user as cache_delete_user
from app.core.redis_cache import get_user as cache_get_user
from app.core.redis_cache import store_user as cache_store_user
from app.models.users import User


def _extract_name(payload: dict) -> str:
    """Google's profile name comes through in user_metadata, under one of
    a couple of possible keys depending on the Supabase/Google version."""
    metadata = payload.get("user_metadata", {}) or {}
    return (
        metadata.get("full_name")
        or metadata.get("name")
        or payload.get("email", "").split("@")[0]
        or "User"
    )


def sync_user_from_token(db: Session, payload: dict) -> User:
    """Idempotent: creates the user on first sign-in, or returns the
    existing record on every subsequent login. Checks Redis before
    Postgres to avoid a DB round-trip on repeat logins."""
    user_id = payload["sub"]
    email = payload["email"]
    name = _extract_name(payload)

    cached = cache_get_user(user_id)
    if cached:
        return cached  # dict, shaped the same as UserResponse

    user = db.query(User).filter(User.id == UUID(user_id)).first()

    if not user:
        user = User(id=UUID(user_id), name=name, email=email)
        db.add(user)
        db.commit()
        db.refresh(user)

    cache_store_user(
        user_id=str(user.id),
        name=user.name,
        email=user.email,
    )

    return user


def get_user_by_id(db: Session, user_id: str):
    cached = cache_get_user(user_id)
    if cached:
        return cached

    user = db.query(User).filter(User.id == UUID(user_id)).first()
    if user:
        cache_store_user(
            user_id=str(user.id),
            name=user.name,
            email=user.email,
        )

    return user


def delete_user_account(db: Session, user_id: str) -> None:
    user = db.query(User).filter(User.id == UUID(user_id)).first()
    if user:
        db.delete(user)  # URL rows cascade-delete via the FK's ondelete="CASCADE"
        db.commit()

    cache_delete_user(user_id)