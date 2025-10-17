from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    # App
    app_name: str = "GiggliAgents API"
    app_version: str = "1.0.0"
    debug: bool = True

    # Security
    secret_key: str
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # Database
    database_url: str

    # Stripe
    stripe_secret_key: str
    stripe_publishable_key: str
    stripe_webhook_secret: str
    stripe_price_id_pro: str = ""

    # SendGrid
    sendgrid_api_key: str = ""
    sendgrid_from_email: str
    sendgrid_from_name: str = "GiggliAgents"

    # AWS S3
    aws_access_key_id: str = ""
    aws_secret_access_key: str = ""
    aws_s3_bucket: str = ""
    aws_region: str = "us-east-1"
    use_s3: bool = False

    # Frontend
    frontend_url: str

    # Storage
    download_path: str = "./downloads"
    max_download_size_mb: int = 200

    # Admin
    admin_email: str
    admin_password: str

    model_config = ConfigDict(env_file=".env", case_sensitive=False, extra="ignore")


@lru_cache
def get_settings():
    return Settings()


settings = get_settings()
