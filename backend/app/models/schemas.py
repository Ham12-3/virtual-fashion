from pydantic import BaseModel, Field


# ── Product ──────────────────────────────────────────────────────────

class ProductColor(BaseModel):
    name: str
    hex: str


class ProductResponse(BaseModel):
    id: str
    name: str
    description: str
    price: int
    images: list[str]
    sizes: list[str]
    colors: list[ProductColor]
    category: str
    collection_slug: str = Field(alias="collectionSlug")
    try_on_compatible: bool = Field(alias="tryOnCompatible")
    tags: list[str]

    model_config = {"populate_by_name": True}


# ── Collection ───────────────────────────────────────────────────────

class CollectionResponse(BaseModel):
    id: str
    name: str
    slug: str
    description: str
    banner_image: str = Field(alias="bannerImage")
    scenario_description: str = Field(alias="scenarioDescription")

    model_config = {"populate_by_name": True}


# ── Try-On ───────────────────────────────────────────────────────────

class TryOnResultResponse(BaseModel):
    id: str
    person_image_url: str = Field(alias="personImageUrl")
    product_image_url: str = Field(alias="productImageUrl")
    result_image_urls: list[str] = Field(alias="resultImageUrls")
    created_at: str = Field(alias="createdAt")

    model_config = {"populate_by_name": True}


class ErrorResponse(BaseModel):
    detail: str
