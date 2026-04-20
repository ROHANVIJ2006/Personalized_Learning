from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/skillnova"
    SECRET_KEY: str = "changeme-use-openssl-rand-hex-32-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days

    FRONTEND_URL: str = "http://localhost:5173"

    MODEL_PATH: str = "./ai_models/trained"
    ASSISTMENTS_DATA_PATH: str = "./datasets/assistments_2012_2013.csv"
    EDNET_DATA_PATH: str = "./datasets/ednet_kt1.csv"

    REDIS_URL: str = "redis://localhost:6379/0"
    APP_ENV: str = "development"
    DEBUG: bool = True
    APP_NAME: str = "SkillNova"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
