from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    frontend_base_url: str = "http://localhost:5173"
    backend_base_url: str = "http://localhost:8000"
    temp_url_expiry_hours: int = 48

    class Config:
        env_file = ".env"


settings = Settings()
