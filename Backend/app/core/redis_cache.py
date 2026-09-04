import json

from app.core.redis import redis_client


TEMP_URL_PREFIX = "temp_url:"
TEMP_URL_CACHE_HOURS = 24


def store_temp_url(
    short_code: str,
    original_url: str,
    ttl_seconds: int = TEMP_URL_CACHE_HOURS * 60 * 60,
) -> None:
    key = f"{TEMP_URL_PREFIX}{short_code}"

    redis_client.set(key,original_url,ex=ttl_seconds,)


def get_temp_url(short_code: str) -> str | None:
    key = f"{TEMP_URL_PREFIX}{short_code}"

    return redis_client.get(key)


def delete_temp_url(short_code: str) -> None:
    key = f"{TEMP_URL_PREFIX}{short_code}"

    redis_client.delete(key)


USER_PREFIX = "user:"
USER_CACHE_TTL_SECONDS = 24 * 60 * 60  # 24h — bounded, not permanent, so a
                                        # stale entry self-heals even if an
                                        # invalidation call is ever missed


def store_user(
    user_id: str,
    name: str,
    email: str,
) -> None:
    key = f"{USER_PREFIX}{user_id}"
    value = json.dumps({"id": user_id, "name": name, "email": email,})

    redis_client.set(key, value, ex=USER_CACHE_TTL_SECONDS)


def get_user(user_id: str) -> dict | None:
    key = f"{USER_PREFIX}{user_id}"
    cached = redis_client.get(key)

    if not cached:
        return None

    return json.loads(cached)


def delete_user(user_id: str) -> None:
    key = f"{USER_PREFIX}{user_id}"

    redis_client.delete(key)