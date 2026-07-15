from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional
from pathlib import Path

class Settings(BaseSettings):
    """
    Application configuration settings.
    Uses environment variables if available, otherwise defaults.
    """
    app_name: str = "FraudGuard AI ML Service"
    version: str = "1.0.0"
    debug_mode: bool = False
    
    # ML Assets configuration
    model_dir: Path = Path("model")
    threshold: Optional[float] = None  # Read exclusively from model_config.json
    
    # CORS Configuration
    # NOTE: "*" is for local development only. 
    # In production, restrict this via .env to actual frontend domains (e.g. ["https://myapp.com"])
    cors_origins: List[str] = ["*"]
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
