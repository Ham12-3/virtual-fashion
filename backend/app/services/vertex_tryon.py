"""
Google Vertex AI Virtual Try-On integration.

Endpoint:
  POST https://{REGION}-aiplatform.googleapis.com/v1/
       projects/{PROJECT_ID}/locations/{REGION}/
       publishers/google/models/virtual-try-on-001:predict

Sends BASE64-encoded person_image and product_image,
receives IMAGE_COUNT generated results. Results are uploaded
to Google Cloud Storage and public URLs are returned.

Falls back to local placeholder generation when GCP credentials
or bucket are unavailable.
"""

from __future__ import annotations

import base64
import logging
import uuid
from io import BytesIO
from pathlib import Path

from app.config import (
    GCP_LOCATION,
    GCP_PROJECT_ID,
    GCS_OUTPUT_BUCKET,
    GCS_OUTPUT_PREFIX,
    GENERATED_DIR,
    TRYON_IMAGE_COUNT,
    TRYON_MODEL,
)

logger = logging.getLogger(__name__)


# ── Custom Errors ────────────────────────────────────────────────────

class TryOnError(Exception):
    """Base error for try-on service."""


class TryOnQuotaError(TryOnError):
    """Raised when Vertex AI quota is exceeded."""


class TryOnValidationError(TryOnError):
    """Raised when Vertex AI rejects an image."""


class TryOnAPIError(TryOnError):
    """Raised on unexpected Vertex AI failures."""


# ── Public API ───────────────────────────────────────────────────────

async def generate_tryon(
    person_image_bytes: bytes,
    garment_image_bytes: bytes,
) -> list[str]:
    """
    Generate virtual try-on images and return a list of public URLs.

    Tries Vertex AI first, then falls back to local placeholder generation.
    Uploads results to GCS when a bucket is configured, otherwise serves
    from the local /generated/ static directory.

    Raises:
        TryOnQuotaError: API quota exceeded — caller should return 429.
        TryOnValidationError: API rejected the images — caller should return 422.
        TryOnAPIError: Unexpected API failure — caller should return 500.
    """
    if not GCP_PROJECT_ID:
        logger.warning("GCP_PROJECT_ID not set — using placeholder generation")
        paths = await _placeholder_generate(person_image_bytes)
        return await _publish_results(paths)

    try:
        paths = await _vertex_generate(person_image_bytes, garment_image_bytes)
        return await _publish_results(paths)

    except (TryOnQuotaError, TryOnValidationError):
        # Re-raise domain errors for the router to handle
        raise

    except Exception as exc:
        logger.error("Vertex AI try-on failed: %s", exc, exc_info=True)
        logger.info("Falling back to placeholder generation")
        paths = await _placeholder_generate(person_image_bytes)
        return await _publish_results(paths)


# ── Vertex AI Call ───────────────────────────────────────────────────

async def _vertex_generate(
    person_image_bytes: bytes,
    garment_image_bytes: bytes,
) -> list[Path]:
    """Call the Vertex AI Virtual Try-On endpoint."""
    from google.api_core.exceptions import (
        GoogleAPICallError,
        ResourceExhausted,
        InvalidArgument,
    )
    from google.cloud import aiplatform
    from google.protobuf import json_format, struct_pb2

    aiplatform.init(project=GCP_PROJECT_ID, location=GCP_LOCATION)

    client = aiplatform.gapic.PredictionServiceClient(
        client_options={
            "api_endpoint": f"{GCP_LOCATION}-aiplatform.googleapis.com"
        }
    )

    endpoint = (
        f"projects/{GCP_PROJECT_ID}/locations/{GCP_LOCATION}"
        f"/publishers/google/models/{TRYON_MODEL}"
    )

    person_b64 = base64.b64encode(person_image_bytes).decode("utf-8")
    garment_b64 = base64.b64encode(garment_image_bytes).decode("utf-8")

    # Build the prediction request per the virtual-try-on-001 spec
    instance = json_format.ParseDict(
        {
            "person_image": {
                "bytesBase64Encoded": person_b64,
            },
            "garment_image": {
                "bytesBase64Encoded": garment_b64,
            },
        },
        struct_pb2.Value(),
    )

    parameters = json_format.ParseDict(
        {
            "imageCount": TRYON_IMAGE_COUNT,
        },
        struct_pb2.Value(),
    )

    try:
        response = client.predict(
            endpoint=endpoint,
            instances=[instance],
            parameters=parameters,
        )
    except ResourceExhausted as exc:
        logger.warning("Vertex AI quota exceeded: %s", exc)
        raise TryOnQuotaError(
            "Virtual try-on quota exceeded. Please try again later."
        ) from exc
    except InvalidArgument as exc:
        logger.warning("Vertex AI rejected input: %s", exc)
        raise TryOnValidationError(
            f"The image was rejected by the AI model: {exc.message}"
        ) from exc
    except GoogleAPICallError as exc:
        logger.error("Vertex AI API error: %s", exc, exc_info=True)
        raise TryOnAPIError(
            f"AI service error ({exc.grpc_status_code}): {exc.message}"
        ) from exc

    # Parse response — each prediction contains a base64-encoded image
    if not response.predictions:
        raise TryOnAPIError("Vertex AI returned no predictions.")

    output_paths: list[Path] = []
    for prediction in response.predictions:
        pred_dict = json_format.MessageToDict(prediction)
        b64_data = pred_dict.get("bytesBase64Encoded", "")
        if not b64_data:
            logger.warning("Empty prediction in response, skipping")
            continue

        img_bytes = base64.b64decode(b64_data)
        file_id = uuid.uuid4().hex[:12]
        out_path = GENERATED_DIR / f"tryon_{file_id}.png"
        out_path.write_bytes(img_bytes)
        output_paths.append(out_path)

    if not output_paths:
        raise TryOnAPIError("Vertex AI returned no valid images.")

    return output_paths


# ── GCS Upload ───────────────────────────────────────────────────────

async def _upload_to_gcs(local_path: Path) -> str:
    """Upload a file to GCS and return its public URL."""
    from google.cloud import storage

    client = storage.Client(project=GCP_PROJECT_ID)
    bucket = client.bucket(GCS_OUTPUT_BUCKET)
    blob_name = f"{GCS_OUTPUT_PREFIX}/{local_path.name}"
    blob = bucket.blob(blob_name)
    blob.upload_from_filename(str(local_path))
    blob.make_public()
    return blob.public_url


# ── Publish Results ──────────────────────────────────────────────────

async def _publish_results(paths: list[Path]) -> list[str]:
    """
    Upload result images to GCS if configured, otherwise return
    local /generated/ paths for the static file server.
    """
    if GCS_OUTPUT_BUCKET:
        urls: list[str] = []
        for path in paths:
            try:
                url = await _upload_to_gcs(path)
                urls.append(url)
            except Exception as exc:
                logger.error("GCS upload failed for %s: %s", path.name, exc)
                # Fall back to local path for this image
                urls.append(f"/generated/{path.name}")
        return urls

    # No GCS bucket — serve from local static directory
    return [f"/generated/{path.name}" for path in paths]


# ── Placeholder Fallback ─────────────────────────────────────────────

async def _placeholder_generate(person_image_bytes: bytes) -> list[Path]:
    """
    Generate placeholder try-on images when Vertex AI is unavailable.
    Produces IMAGE_COUNT variants with different gold tint intensities.
    """
    from PIL import Image, ImageDraw, ImageFont

    output_paths: list[Path] = []
    tint_alphas = [40, 55, 35, 50]  # slight variation per image

    for i in range(TRYON_IMAGE_COUNT):
        img = Image.open(BytesIO(person_image_bytes)).convert("RGBA")

        # Gold tint overlay with varying intensity
        alpha = tint_alphas[i % len(tint_alphas)]
        overlay = Image.new("RGBA", img.size, (201, 168, 76, alpha))
        img = Image.alpha_composite(img, overlay)
        img = img.convert("RGB")

        # Watermark text
        draw = ImageDraw.Draw(img)
        try:
            font = ImageFont.truetype("arial.ttf", max(20, img.width // 25))
        except OSError:
            font = ImageFont.load_default()

        text = "VIRTUAL TRY-ON PREVIEW"
        bbox = draw.textbbox((0, 0), text, font=font)
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
        x = (img.width - tw) // 2
        y = img.height - th - 40
        # Shadow
        draw.text((x + 1, y + 1), text, fill=(26, 26, 26), font=font)
        draw.text((x, y), text, fill=(201, 168, 76), font=font)

        # Variant label
        variant_text = f"Variant {i + 1} of {TRYON_IMAGE_COUNT}"
        vbox = draw.textbbox((0, 0), variant_text, font=font)
        vw = vbox[2] - vbox[0]
        draw.text(
            ((img.width - vw) // 2, y - th - 20),
            variant_text,
            fill=(201, 168, 76, 180),
            font=font,
        )

        file_id = uuid.uuid4().hex[:12]
        out_path = GENERATED_DIR / f"tryon_{file_id}.jpg"
        img.save(out_path, "JPEG", quality=90)
        output_paths.append(out_path)

    return output_paths
