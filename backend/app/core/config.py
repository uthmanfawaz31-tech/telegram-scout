from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Union
from pydantic import field_validator
from dotenv import load_dotenv
import os

# Force load .env from current working directory
load_dotenv(os.path.join(os.getcwd(), '.env'), override=True)

class Settings(BaseSettings):
    PROJECT_NAME: str = "Telegram Broadcasting Platform"
    API_V1_STR: str = "/api/v1"
    
    # DATABASE
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "password"
    POSTGRES_DB: str = "telegram_broadcasting"
    
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}/{self.POSTGRES_DB}"

    # REDIS / CELERY
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    
    @property
    def CELERY_BROKER_URL(self) -> str:
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/0"
    
    @property
    def CELERY_RESULT_BACKEND(self) -> str:
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/0"

    # TELEGRAM
    TELEGRAM_API_ID: str = ""
    TELEGRAM_API_HASH: str = ""

    # CORS
    # Define as a string first to avoid parsing issues from .env, then we'll convert it
    BACKEND_CORS_ORIGINS: Union[str, List[str]] = "http://localhost:3000"

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                # Handle it if it's already a JSON-like string
                import json
                return json.loads(v)
            return [i.strip() for i in v.split(",")]
        return v

    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
        extra="ignore"
    )

settings = Settings()
