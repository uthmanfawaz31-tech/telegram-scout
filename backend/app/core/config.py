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
    # If using Turso, this will look like libsql://...
    DATABASE_URL: str = "sqlite:///./test.db"
    TURSO_AUTH_TOKEN: str = ""

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        url = self.DATABASE_URL
        if "turso.io" in url or url.startswith("libsql://") or url.startswith("https://"):
            # Strip prefixes to get just the hostname
            hostname = url.replace("libsql://", "").replace("https://", "").split("?")[0].rstrip("/")
            # sqlalchemy-libsql expects sqlite+libsql://hostname
            # We add secure=true if it was originally an https:// or libsql:// url
            return f"sqlite+libsql://{hostname}/?secure=true"
        return url


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
            if not v:
                return []
            if v.startswith("[") and v.endswith("]"):
                import json
                try:
                    return json.loads(v)
                except Exception:
                    pass
            # Clean up potential quotes and spaces
            cleaned = v.strip().replace('"', "").replace("'", "")
            return [i.strip() for i in cleaned.split(",") if i.strip()]
        return v

    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
        extra="ignore"
    )

settings = Settings()
