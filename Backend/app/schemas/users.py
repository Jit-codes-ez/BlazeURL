from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserResponse(BaseModel):
    id: UUID
    name: str
    email: EmailStr

    class Config:
        from_attributes = True