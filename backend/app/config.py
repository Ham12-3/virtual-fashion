import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

# Google Cloud
GCP_PROJECT_ID: str = os.getenv("GCP_PROJECT_ID", "")
GCP_LOCATION: str = os.getenv("GCP_LOCATION", "us-central1")
GCS_OUTPUT_BUCKET: str = os.getenv("GCS_OUTPUT_BUCKET", "")
GCS_OUTPUT_PREFIX: str = os.getenv("GCS_OUTPUT_PREFIX", "tryon-results")

# Virtual Try-On
TRYON_IMAGE_COUNT: int = 4
TRYON_MODEL: str = "virtual-try-on-001"

# CORS
FRONTEND_ORIGIN: str = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

# Rate limiting
RATE_LIMIT: str = os.getenv("RATE_LIMIT", "10/minute")

# Generated images (local fallback when GCS is unavailable)
BACKEND_DIR = Path(__file__).resolve().parent.parent
GENERATED_DIR: Path = BACKEND_DIR / os.getenv("GENERATED_DIR", "generated")
GENERATED_DIR.mkdir(parents=True, exist_ok=True)

# Image validation
MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10 MB
MIN_RESOLUTION: int = 512
ALLOWED_CONTENT_TYPES: set[str] = {"image/jpeg", "image/png"}
