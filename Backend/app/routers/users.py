from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth_dependencies import get_current_user
from app.database import get_db
from app.schemas.users import UserResponse
from app.services import user_service

router = APIRouter(prefix="/users", tags=["Users"])


def _to_response(user) -> UserResponse:
    """user may be a SQLAlchemy User object (cache miss, fresh from DB)
    or a plain dict (cache hit) — normalize both into the response shape."""
    if isinstance(user, dict):
        return UserResponse(
            id=str(user["id"]),
            name=user["name"],
            email=user["email"],
        )

    return UserResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
    )


@router.post("/auth", response_model=UserResponse)
def continue_with_google(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Called after every successful Google sign-in — creates the user on
    their first login, or just confirms/returns them on every login after
    that. One endpoint covers both, since Google auth doesn't distinguish
    new vs. returning users."""
    user = user_service.sync_user_from_token(db, current_user)
    return _to_response(user)


@router.get("/dashboard", response_model=UserResponse)
def get_me(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user = user_service.get_user_by_id(db, current_user["sub"])
    return _to_response(user)


@router.delete("/me", status_code=204)
def delete_me(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_service.delete_user_account(db, current_user["sub"])