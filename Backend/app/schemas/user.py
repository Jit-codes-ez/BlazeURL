from pydantic import BaseModel, EmailStr
from uuid import UUID


class UserResponse(BaseModel):
    id: UUID
    name: str 
    email: EmailStr