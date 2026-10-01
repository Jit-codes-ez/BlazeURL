from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    frontend_base_url: str = "http://localhost:5173"
    backend_base_url: str = "http://localhost:8000"
    temp_url_expiry_hours: int = 48

    supabase_url: str = ""
    supabase_key: str = ""

    redis_url: str = ""

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
