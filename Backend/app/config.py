from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    frontend_base_url: str 
    backend_base_url: str 
    temp_url_expiry_hours: int 

    supabase_url: str
    supabase_key: str

    redis_url: str

    class Config:
        env_file = ".env"


settings = Settings()
