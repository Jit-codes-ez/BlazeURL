from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, HttpUrl


class UserURLCreate(BaseModel):
    original_url: HttpUrl
    expires_at: datetime | None = None
    custom_alias: str | None = Field(
        default=None,
        max_length=30,
        pattern=r"^[a-zA-Z0-9_-]+$",
    )
    title: str | None = Field(
        default=None,
        max_length=60,
    )
    make_qr: bool = False


class UserURLResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    original_url: str
    short_code: str
    short_url: str
    custom_alias: str | None
    title: str | None
    expires_at: datetime | None
    qr_generated: bool
    click_count: int
    created_at: datetime


class UserURLListResponse(BaseModel):
    urls: list[UserURLResponse]
    total: int


class UserURLDeleteResponse(BaseModel):
    message: str