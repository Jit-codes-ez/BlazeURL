from redis import Redis

from app.config import settings


if settings.redis_url and settings.redis_url.startswith(("redis://", "rediss://", "unix://")):
    redis_client = Redis.from_url(
        settings.redis_url,
        decode_responses=True,
    )
else:
    redis_client = Redis.from_url(
        "redis://localhost:6379",
        decode_responses=True,
    )
