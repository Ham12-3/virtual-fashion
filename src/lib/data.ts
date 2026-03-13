import type { Collection, Product } from "@/types";

// ── Collections ──────────────────────────────────────────────────────

export const collections: Collection[] = [
  {
    id: "col-santorini",
    name: "Summer in Santorini",
    slug: "summer-in-santorini",
    description:
      "Sun-drenched elegance inspired by the Aegean coast. Breathable linens, flowing silhouettes, and a palette drawn from whitewashed villages and turquoise waters.",
    bannerImage: "/images/collections/santorini-banner.jpg",
    scenarioDescription:
      "Each piece styled against the iconic blue domes and sunlit terraces of Santorini.",
  },
  {
    id: "col-noir",
    name: "Urban Noir",
    slug: "urban-noir",
    description:
      "After-dark sophistication for the modern city. Sharp tailoring, rich textures, and an unapologetically dark palette.",
    bannerImage: "/images/collections/urban-noir-banner.jpg",
    scenarioDescription:
      "Shot on rain-slicked city streets under neon light, capturing metropolitan edge.",
  },
  {
    id: "col-bohemian",
    name: "Bohemian Dreams",
    slug: "bohemian-dreams",
    description:
      "Free-spirited artistry meets refined craft. Hand-embroidered details, earthy tones, and relaxed proportions for the modern wanderer.",
    bannerImage: "/images/collections/bohemian-dreams-banner.jpg",
    scenarioDescription:
      "Photographed in golden-hour fields and rustic ateliers, evoking effortless romance.",
  },
];

// ── Products ─────────────────────────────────────────────────────────

export const products: Product[] = [
  // ─── Summer in Santorini (4) ───────────────────────────────────────
  {
    id: "san-001",
    name: "Aegean Linen Shirt",
    description:
      "Relaxed-fit shirt in garment-washed French linen. Mother-of-pearl buttons and a camp collar give it an effortless Mediterranean feel.",
    price: 480,
    images: [
      "/images/products/aegean-linen-shirt-1.jpg",
      "/images/products/aegean-linen-shirt-2.jpg",
      "/images/products/aegean-linen-shirt-3.jpg",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Ivory", hex: "#F5F0E8" },
      { name: "Sky", hex: "#87CEEB" },
      { name: "Sand", hex: "#C2B280" },
    ],
    category: "Tops",
    collectionSlug: "summer-in-santorini",
    tryOnCompatible: true,
    tags: ["linen", "summer", "new-arrival"],
  },
  {
    id: "san-002",
    name: "Caldera Sundress",
    description:
      "A flowing midi sundress in lightweight cotton voile. Delicate pintuck detailing at the bodice with an open back and adjustable straps.",
    price: 890,
    images: [
      "/images/products/caldera-sundress-1.jpg",
      "/images/products/caldera-sundress-2.jpg",
      "/images/products/caldera-sundress-3.jpg",
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Terracotta", hex: "#CC6B49" },
    ],
    category: "Dresses",
    collectionSlug: "summer-in-santorini",
    tryOnCompatible: true,
    tags: ["cotton", "summer", "bestseller"],
  },
  {
    id: "san-003",
    name: "Oia Leather Sandals",
    description:
      "Handcrafted flat sandals in vegetable-tanned Italian leather. Ankle-wrap straps and a cushioned insole for all-day comfort.",
    price: 420,
    images: [
      "/images/products/oia-leather-sandals-1.jpg",
      "/images/products/oia-leather-sandals-2.jpg",
    ],
    sizes: ["36", "37", "38", "39", "40", "41"],
    colors: [
      { name: "Natural", hex: "#D2A679" },
      { name: "Black", hex: "#1A1A1A" },
    ],
    category: "Shoes",
    collectionSlug: "summer-in-santorini",
    tryOnCompatible: false,
    tags: ["leather", "handcrafted", "summer"],
  },
  {
    id: "san-004",
    name: "Fira Wrap Skirt",
    description:
      "Asymmetric wrap skirt in crinkled linen blend. Side-tie closure and a raw-edge hem give it artisanal character.",
    price: 560,
    images: [
      "/images/products/fira-wrap-skirt-1.jpg",
      "/images/products/fira-wrap-skirt-2.jpg",
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Oatmeal", hex: "#D3C4A5" },
      { name: "Cobalt", hex: "#3B5998" },
    ],
    category: "Bottoms",
    collectionSlug: "summer-in-santorini",
    tryOnCompatible: true,
    tags: ["linen", "summer"],
  },

  // ─── Urban Noir (4) ────────────────────────────────────────────────
  {
    id: "noir-001",
    name: "Montmartre Wool Blazer",
    description:
      "Double-breasted blazer in Italian super-120s wool. Peak lapels, a nipped waist, and silk lining make it equally at home in the boardroom and the bar.",
    price: 2450,
    images: [
      "/images/products/montmartre-blazer-1.jpg",
      "/images/products/montmartre-blazer-2.jpg",
      "/images/products/montmartre-blazer-3.jpg",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Black", hex: "#1A1A1A" },
      { name: "Charcoal", hex: "#36454F" },
    ],
    category: "Outerwear",
    collectionSlug: "urban-noir",
    tryOnCompatible: true,
    tags: ["wool", "tailored", "bestseller"],
  },
  {
    id: "noir-002",
    name: "Nuit Leather Jacket",
    description:
      "Slim-cut moto jacket in butter-soft lambskin. Gunmetal hardware, asymmetric zip, and quilted shoulder panels for an edge that never goes out of style.",
    price: 3200,
    images: [
      "/images/products/nuit-leather-jacket-1.jpg",
      "/images/products/nuit-leather-jacket-2.jpg",
      "/images/products/nuit-leather-jacket-3.jpg",
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Noir", hex: "#0D0D0D" },
      { name: "Oxblood", hex: "#4A0000" },
    ],
    category: "Outerwear",
    collectionSlug: "urban-noir",
    tryOnCompatible: true,
    tags: ["leather", "statement", "new-arrival"],
  },
  {
    id: "noir-003",
    name: "Boulevard Chelsea Boots",
    description:
      "Sleek Chelsea boots in polished calfskin with a 40mm Cuban heel. Elasticated side panels and a pull-tab for easy on-and-off.",
    price: 1180,
    images: [
      "/images/products/boulevard-boots-1.jpg",
      "/images/products/boulevard-boots-2.jpg",
    ],
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
    colors: [
      { name: "Black", hex: "#1A1A1A" },
    ],
    category: "Shoes",
    collectionSlug: "urban-noir",
    tryOnCompatible: false,
    tags: ["leather", "classic"],
  },
  {
    id: "noir-004",
    name: "Silk Noir Midi Dress",
    description:
      "Figure-skimming midi dress in heavy silk crepe. High neckline, open back, and a concealed side zip create understated evening drama.",
    price: 1280,
    images: [
      "/images/products/silk-noir-dress-1.jpg",
      "/images/products/silk-noir-dress-2.jpg",
      "/images/products/silk-noir-dress-3.jpg",
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Black", hex: "#1A1A1A" },
      { name: "Midnight", hex: "#191970" },
    ],
    category: "Dresses",
    collectionSlug: "urban-noir",
    tryOnCompatible: true,
    tags: ["silk", "evening", "bestseller"],
  },

  // ─── Bohemian Dreams (4) ───────────────────────────────────────────
  {
    id: "boho-001",
    name: "Marrakech Flowing Dress",
    description:
      "Floor-length tiered dress in washed cotton gauze. Balloon sleeves, a drawstring waist, and hand-dyed ombré finish evoke desert sunsets.",
    price: 760,
    images: [
      "/images/products/marrakech-dress-1.jpg",
      "/images/products/marrakech-dress-2.jpg",
      "/images/products/marrakech-dress-3.jpg",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Rust", hex: "#B7410E" },
      { name: "Sage", hex: "#9CAF88" },
    ],
    category: "Dresses",
    collectionSlug: "bohemian-dreams",
    tryOnCompatible: true,
    tags: ["cotton", "artisanal", "new-arrival"],
  },
  {
    id: "boho-002",
    name: "Atlas Embroidered Top",
    description:
      "Cropped blouse in organic cotton with intricate hand-embroidered floral motifs. Puff sleeves, a smocked back panel, and mother-of-pearl buttons.",
    price: 540,
    images: [
      "/images/products/atlas-embroidered-top-1.jpg",
      "/images/products/atlas-embroidered-top-2.jpg",
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Cream", hex: "#FFFDD0" },
      { name: "Dusty Rose", hex: "#DCAE96" },
    ],
    category: "Tops",
    collectionSlug: "bohemian-dreams",
    tryOnCompatible: true,
    tags: ["embroidered", "handcrafted", "bestseller"],
  },
  {
    id: "boho-003",
    name: "Nomad Woven Tote",
    description:
      "Oversized tote bag handwoven from sustainably sourced raffia. Leather-trimmed handles and an interior zip pocket. Each piece is unique.",
    price: 680,
    images: [
      "/images/products/nomad-woven-tote-1.jpg",
      "/images/products/nomad-woven-tote-2.jpg",
    ],
    sizes: ["One Size"],
    colors: [
      { name: "Natural", hex: "#D2B48C" },
      { name: "Black Mix", hex: "#2C2C2C" },
    ],
    category: "Accessories",
    collectionSlug: "bohemian-dreams",
    tryOnCompatible: false,
    tags: ["woven", "sustainable", "handcrafted"],
  },
  {
    id: "boho-004",
    name: "Essaouira Crochet Cardigan",
    description:
      "Open-front cardigan in hand-crocheted mercerised cotton. Scalloped edges, a relaxed drop-shoulder fit, and fringe detailing at the hem.",
    price: 620,
    images: [
      "/images/products/essaouira-cardigan-1.jpg",
      "/images/products/essaouira-cardigan-2.jpg",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Ecru", hex: "#F0EAD6" },
      { name: "Terracotta", hex: "#CC6B49" },
    ],
    category: "Tops",
    collectionSlug: "bohemian-dreams",
    tryOnCompatible: true,
    tags: ["crochet", "artisanal"],
  },
];

// ── Helpers ──────────────────────────────────────────────────────────

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCollection(slug: string): Product[] {
  return products.filter((p) => p.collectionSlug === slug);
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents);
}
