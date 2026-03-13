import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Request, UploadFile, File, Form
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.config import RATE_LIMIT
from app.data import get_product_by_id
from app.image_validation import validate_image
from app.models.schemas import TryOnResultResponse
from app.services.vertex_tryon import (
    generate_tryon,
    TryOnQuotaError,
    TryOnValidationError,
    TryOnAPIError,
)

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/api", tags=["try-on"])


@router.post(
    "/try-on",
    response_model=TryOnResultResponse,
    responses={
        422: {"description": "Validation error (image or product)"},
        429: {"description": "Rate limit or API quota exceeded"},
        500: {"description": "Generation failed"},
    },
)
@limiter.limit(RATE_LIMIT)
async def virtual_try_on(
    request: Request,
    person_image: UploadFile = File(
        ..., description="Person photo (JPG/PNG, max 10 MB, min 512×512)"
    ),
    product_id: str = Form(..., description="Product ID to try on"),
):
    # ── Validate product ─────────────────────────────────────────
    product = get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    if not product.get("tryOnCompatible", False):
        raise HTTPException(
            status_code=422,
            detail="This product does not support virtual try-on.",
        )

    # ── Validate person image ────────────────────────────────────
    person_bytes = await validate_image(person_image, label="Person image")

    # In production the garment image would come from a pre-segmented
    # asset stored alongside the product. For now we pass the person
    # image as a placeholder so the pipeline still executes end-to-end.
    garment_bytes = person_bytes

    # ── Generate ─────────────────────────────────────────────────
    try:
        result_urls = await generate_tryon(person_bytes, garment_bytes)
    except TryOnQuotaError as exc:
        raise HTTPException(status_code=429, detail=str(exc))
    except TryOnValidationError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except TryOnAPIError as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail=f"Unexpected error: {exc}"
        )

    # ── Resolve relative URLs ────────────────────────────────────
    base_url = str(request.base_url).rstrip("/")
    resolved_urls = [
        url if url.startswith("http") else f"{base_url}{url}"
        for url in result_urls
    ]

    result_id = uuid.uuid4().hex[:16]

    return TryOnResultResponse(
        id=result_id,
        personImageUrl=f"{base_url}/generated/person_{result_id}.jpg",
        productImageUrl=product["images"][0],
        resultImageUrls=resolved_urls,
        createdAt=datetime.now(timezone.utc).isoformat(),
    )
