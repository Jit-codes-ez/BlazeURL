from uuid import UUID

from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.user_urls import (
    UserURLCreate,
    UserURLDeleteResponse,
    UserURLListResponse,
    UserURLResponse,
)
from app.services.user_urls_service import (
    create_user_url,
    delete_user_url,
    get_user_url,
    get_user_urls,
)
from app.core.auth_dependencies import get_current_user


router = APIRouter(prefix="/api/urls",tags=["User URLs"],)


def get_user_id(current_user):
    if isinstance(current_user, dict):
        user_id = current_user.get("id") or current_user.get("sub")
    else:
        user_id = getattr(current_user, "id", None)

    if not user_id:
        raise ValueError("Authenticated user ID is missing.")

    return user_id


def serialize_url(
    url,
    base_url: str,
) -> UserURLResponse:
    return UserURLResponse(
        id=url.id,
        original_url=url.original_url,
        short_code=url.short_code,
        short_url=f"{base_url}/{url.short_code}",
        custom_alias=url.custom_alias,
        title=url.title,
        expires_at=url.expires_at,
        qr_generated=url.qr_generated,
        click_count=url.click_count,
        created_at=url.created_at,
    )


@router.post("",response_model=UserURLResponse,status_code=status.HTTP_201_CREATED,)
def create_url(
    data: UserURLCreate,
    request: Request,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_id = get_user_id(current_user)

    base_url = str(request.base_url).rstrip("/")

    url = create_user_url(
        db=db,
        user_id=user_id,
        data=data,
        base_url=base_url,
    )

    return serialize_url(url, base_url)


@router.get("",response_model=UserURLListResponse,)
def list_urls(
    request: Request,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_id = get_user_id(current_user)

    base_url = str(request.base_url).rstrip("/")

    urls, total = get_user_urls(
        db=db,
        user_id=user_id,
    )

    return UserURLListResponse(
        urls=[
            serialize_url(url, base_url)
            for url in urls
        ],
        total=total,
    )


@router.get("/{url_id}",response_model=UserURLResponse,)
def get_url(
    url_id: UUID,
    request: Request,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_id = get_user_id(current_user)

    base_url = str(request.base_url).rstrip("/")

    url = get_user_url(
        db=db,
        user_id=user_id,
        url_id=url_id,
    )

    return serialize_url(url, base_url)


@router.delete("/{url_id}",response_model=UserURLDeleteResponse,)
def delete_url(
    url_id: UUID,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_id = get_user_id(current_user)

    delete_user_url(
        db=db,
        user_id=user_id,
        url_id=url_id,
    )

    return UserURLDeleteResponse(
        message="Short URL deleted successfully."
    )