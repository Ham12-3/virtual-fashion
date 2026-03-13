import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.config import FRONTEND_ORIGIN, GENERATED_DIR
from app.routers import products, tryon

logging.basicConfig(level=logging.INFO)

# ── App ──────────────────────────────────────────────────────────────

app = FastAPI(
    title="Maison Élégance API",
    description="Backend for the Maison Élégance luxury fashion platform.",
    version="0.1.0",
)

# ── CORS ─────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Rate Limiting ────────────────────────────────────────────────────

app.state.limiter = tryon.limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── Static files for generated images ────────────────────────────────

app.mount("/generated", StaticFiles(directory=str(GENERATED_DIR)), name="generated")

# ── Routers ──────────────────────────────────────────────────────────

app.include_router(products.router)
app.include_router(tryon.router)


# ── Health ───────────────────────────────────────────────────────────

@app.get("/health", tags=["system"])
async def health():
    return {"status": "ok"}
