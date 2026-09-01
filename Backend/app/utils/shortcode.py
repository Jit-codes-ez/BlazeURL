import secrets
import string

from sqlalchemy.orm import Session

from app.models.temp_url import TempURL

ALPHABET = string.ascii_letters + string.digits  # a-zA-Z0-9, URL-safe
CODE_LENGTH = 7


def generate_code(length: int = CODE_LENGTH) -> str:
    return "".join(secrets.choice(ALPHABET) for _ in range(length))


def generate_unique_short_code(db: Session) -> str:
    for _ in range(5):
        code = generate_code()
        exists = db.query(TempURL).filter(TempURL.short_code == code).first()
        if not exists:
            return code

    # Extremely unlikely to ever hit this — fall back to a longer code
    return generate_code(length=CODE_LENGTH + 4)
