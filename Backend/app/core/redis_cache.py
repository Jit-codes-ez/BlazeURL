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