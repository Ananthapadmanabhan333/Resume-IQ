from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Resume Scanner API"
    OPENAI_API_KEY: str = ""
    DATABASE_URL: str = "postgresql://postgres:password@db:5432/resume_db"
    
    class Config:
        env_file = ".env"

settings = Settings()
