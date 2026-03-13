from fastapi import APIRouter, HTTPException, Query

from app.data import COLLECTIONS, PRODUCTS, get_product_by_id, get_products_by_collection
from app.models.schemas import CollectionResponse, ProductResponse

router = APIRouter(prefix="/api", tags=["products"])


@router.get("/products", response_model=list[ProductResponse])
async def list_products(
    collection: str | None = Query(None, description="Filter by collection slug"),
):
    if collection:
        items = get_products_by_collection(collection)
    else:
        items = PRODUCTS
    return items


@router.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    product = get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    return product


@router.get("/collections", response_model=list[CollectionResponse])
async def list_collections():
    return COLLECTIONS
