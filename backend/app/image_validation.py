from io import BytesIO

from fastapi import HTTPException, UploadFile
from PIL import Image

from app.config import ALLOWED_CONTENT_TYPES, MAX_FILE_SIZE, MIN_RESOLUTION


async def validate_image(file: UploadFile, label: str = "Image") -> bytes:
    """Read, validate, and return the raw bytes of an uploaded image."""

    # Content type
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=422,
            detail=f"{label} must be JPEG or PNG (got {file.content_type}).",
        )

    # Read bytes & check size
    data = await file.read()
    if len(data) > MAX_FILE_SIZE:
        mb = MAX_FILE_SIZE // (1024 * 1024)
        raise HTTPException(
            status_code=422,
            detail=f"{label} exceeds the {mb} MB limit.",
        )

    # Resolution
    try:
        img = Image.open(BytesIO(data))
        w, h = img.size
    except Exception:
        raise HTTPException(
            status_code=422,
            detail=f"{label} could not be opened as a valid image.",
        )

    if w < MIN_RESOLUTION or h < MIN_RESOLUTION:
        raise HTTPException(
            status_code=422,
            detail=(
                f"{label} must be at least {MIN_RESOLUTION}×{MIN_RESOLUTION}px "
                f"(got {w}×{h})."
            ),
        )

    return data
