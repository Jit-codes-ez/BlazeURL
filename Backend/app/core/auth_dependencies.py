from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.security import verify_token

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """Returns the decoded JWT payload. Key fields:
    - payload["sub"]   -> Supabase user id (UUID string)
    - payload["email"] -> user's email
    - payload["user_metadata"] -> dict, may contain "full_name", "avatar_url", etc.
    """
    payload = await verify_token(credentials.credentials)
    return payload