import jwt
from jwt import PyJWKClient
from fastapi import HTTPException, status

from app.config import settings

JWKS_URL = f"{settings.supabase_url}/auth/v1/.well-known/jwks.json"

# Created once at module load — PyJWKClient caches fetched signing keys
# internally, so this avoids hitting the JWKS endpoint on every request.
jwks_client = PyJWKClient(JWKS_URL)


async def verify_token(token: str) -> dict:
    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)

        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256"],
            audience="authenticated",
        )

        return payload

    except HTTPException:
        raise  # don't let the generic handler below swallow our own 401s

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
        )

    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication token: {e}",
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {e}",
        )