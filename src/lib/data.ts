import type { Collection, Product } from "@/types";

// ── Collections ──────────────────────────────────────────────────────

export const collections: Collection[] = [
  {
    id: "col-santorini",
    name: "Summer in Santorini",
    slug: "summer-in-santorini",
    description:
      "Sun-drenched elegance inspired by the Aegean coast. Breathable linens, flowing silhouettes, and a palette drawn from whitewashed villages and turquoise waters.",
    bannerImage: "https://images.unsplash.com/photo-1763604608266-6ee862e562da?w=1920&q=80",
    scenarioDescription:
      "Each piece styled against the iconic blue domes and sunlit terraces of Santorini.",
  },
  {
    id: "col-noir",
    name: "Urban Noir",
    slug: "urban-noir",
    description:
      "After-dark sophistication for the modern city. Sharp tailoring, rich textures, and an unapologetically dark palette.",
    bannerImage: "https://images.unsplash.com/photo-1639678763679-73d600a85b2d?w=1920&q=80",
    scenarioDescription:
      "Shot on rain-slicked city streets under neon light, capturing metropolitan edge.",
  },
  {
    id: "col-bohemian",
    name: "Bohemian Dreams",
    slug: "bohemian-dreams",
    description:
      "Free-spirited artistry meets refined craft. Hand-embroidered details, earthy tones, and relaxed proportions for the modern wanderer.",
    bannerImage: "https://images.unsplash.com/photo-1753874384065-1a8c5adc8436?w=1920&q=80",
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
      "https://images.unsplash.com/photo-1766113492742-396e7d928a58?w=800&q=80",
      "https://images.unsplash.com/photo-1519743670471-034311358429?w=800&q=80",
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
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
      "https://images.unsplash.com/photo-1746730921745-5f6afa4c56c3?w=800&q=80",
      "https://images.unsplash.com/photo-1746864946880-607973ca1c3b?w=800&q=80",
      "https://images.unsplash.com/photo-1595353794806-702a05e814de?w=800&q=80",
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
      "https://images.unsplash.com/photo-1625318880107-49baad6765fd?w=800&q=80",
      "https://images.unsplash.com/photo-1663693586817-f7e0ceb27bd7?w=800&q=80",
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
      "https://images.unsplash.com/photo-1673823429135-c7b0d40cfe56?w=800&q=80",
      "https://images.unsplash.com/photo-1611956581419-af8b753a5cef?w=800&q=80",
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

  // ─── Urban Noir — Men's (4) ────────────────────────────────────────
  {
    id: "noir-001",
    name: "Montmartre Wool Blazer",
    description:
      "Double-breasted blazer in Italian super-120s wool. Peak lapels, a structured shoulder, and silk lining — equally at home in the boardroom and the bar.",
    price: 2450,
    images: [
      "https://images.unsplash.com/photo-1644269444230-c6d1f2722e10?w=800&q=80",
      "https://images.unsplash.com/photo-1608253458784-355ada87ba76?w=800&q=80",
      "https://images.unsplash.com/photo-1738999633481-529934314fed?w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
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
      "https://images.unsplash.com/photo-1762160768571-934c45a9d0b4?w=800&q=80",
      "https://images.unsplash.com/photo-1740329181397-dc8126a9e442?w=800&q=80",
      "https://images.unsplash.com/photo-1751246672691-5013957e5c55?w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
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
      "https://images.unsplash.com/photo-1581803274668-261faa12dca7?w=800&q=80",
      "https://images.unsplash.com/photo-1572550907105-dc3c8e55f5b1?w=800&q=80",
    ],
    sizes: ["40", "41", "42", "43", "44", "45"],
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
    name: "Obsidian Tailored Trousers",
    description:
      "Slim-tapered trousers in Italian stretch wool. Flat front, side adjusters, and a pressed crease for sharp, modern tailoring.",
    price: 980,
    images: [
      "https://images.unsplash.com/photo-1584865288642-42078afe6942?w=800&q=80",
      "https://images.unsplash.com/photo-1618886614638-80e3c103d31a?w=800&q=80",
      "https://images.unsplash.com/photo-1577394580379-0b59ce5e1f01?w=800&q=80",
    ],
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: [
      { name: "Black", hex: "#1A1A1A" },
      { name: "Charcoal", hex: "#36454F" },
    ],
    category: "Bottoms",
    collectionSlug: "urban-noir",
    tryOnCompatible: true,
    tags: ["wool", "tailored", "bestseller"],
  },

  // ─── Bohemian Dreams (4) ───────────────────────────────────────────
  {
    id: "boho-001",
    name: "Marrakech Flowing Dress",
    description:
      "Floor-length tiered dress in washed cotton gauze. Balloon sleeves, a drawstring waist, and hand-dyed ombré finish evoke desert sunsets.",
    price: 760,
    images: [
      "https://images.unsplash.com/photo-1518573053307-b4e045569e53?w=800&q=80",
      "https://images.unsplash.com/photo-1591085439840-23dbb7ff0609?w=800&q=80",
      "https://images.unsplash.com/photo-1623609163849-27f393222319?w=800&q=80",
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
      "https://images.unsplash.com/photo-1669197798911-68a45e28e35a?w=800&q=80",
      "https://images.unsplash.com/photo-1693987263090-9db764295654?w=800&q=80",
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
      "https://images.unsplash.com/photo-1763056531605-4e75d78e5016?w=800&q=80",
      "https://images.unsplash.com/photo-1641934823408-e6b3b546873d?w=800&q=80",
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
      "https://images.unsplash.com/photo-1695902264392-9d0a9137ca4d?w=800&q=80",
      "https://images.unsplash.com/photo-1552959933-595ad8829c0f?w=800&q=80",
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

  // ─── Accessories (cross-collection) ──────────────────────────────
  {
    id: "acc-001",
    name: "Noir Aviator Sunglasses",
    description:
      "Titanium-frame aviators with polarised smoke lenses. Ultra-lightweight at 22g with adjustable nose pads and a brushed gunmetal finish.",
    price: 520,
    images: [
      "https://images.unsplash.com/photo-1762706334838-ea8425b43116?w=800&q=80",
      "https://images.unsplash.com/photo-1759130021732-fadfd047a1f8?w=800&q=80",
    ],
    sizes: ["One Size"],
    colors: [
      { name: "Gunmetal", hex: "#2A3439" },
      { name: "Gold", hex: "#C9A84C" },
    ],
    category: "Accessories",
    collectionSlug: "urban-noir",
    tryOnCompatible: false,
    tags: ["titanium", "polarised", "new-arrival"],
  },
  {
    id: "acc-002",
    name: "Signature Leather Belt",
    description:
      "Hand-stitched belt in full-grain Italian leather. Solid brass buckle with an engraved Maison Élégance monogram.",
    price: 380,
    images: [
      "https://images.unsplash.com/photo-1664286074240-d7059e004dff?w=800&q=80",
      "https://images.unsplash.com/photo-1649860359778-0bb95cb88ea9?w=800&q=80",
    ],
    sizes: ["80cm", "85cm", "90cm", "95cm", "100cm"],
    colors: [
      { name: "Black", hex: "#1A1A1A" },
      { name: "Cognac", hex: "#834A21" },
    ],
    category: "Accessories",
    collectionSlug: "urban-noir",
    tryOnCompatible: false,
    tags: ["leather", "classic", "bestseller"],
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
