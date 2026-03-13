export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  category: string;
  collectionSlug: string;
  tryOnCompatible: boolean;
  tags: string[];
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  bannerImage: string;
  scenarioDescription: string;
}

export interface TryOnRequest {
  personImage: File;
  productId: string;
}

export interface TryOnResult {
  id: string;
  personImageUrl: string;
  productImageUrl: string;
  resultImageUrls: string[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: ProductColor;
  tryOnImageUrl?: string;
}

export interface FilterState {
  categories: string[];
  sizes: string[];
  colors: string[];
  priceRange: { min: number; max: number };
  sortBy: "featured" | "price-asc" | "price-desc" | "newest";
}
