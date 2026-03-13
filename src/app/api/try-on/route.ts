import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getProductById } from "@/lib/data";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png"]);
const TRYON_IMAGE_COUNT = 4;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const personFile = formData.get("person_image") as File | null;
    const productId = formData.get("product_id") as string | null;

    // ── Validate inputs ──────────────────────────────────────────
    if (!personFile || !productId) {
      return NextResponse.json(
        { detail: "person_image and product_id are required." },
        { status: 422 }
      );
    }

    if (!ALLOWED_TYPES.has(personFile.type)) {
      return NextResponse.json(
        { detail: `Person image must be JPEG or PNG (got ${personFile.type}).` },
        { status: 422 }
      );
    }

    if (personFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { detail: "Person image exceeds the 10 MB limit." },
        { status: 422 }
      );
    }

    const product = getProductById(productId);
    if (!product) {
      return NextResponse.json(
        { detail: "Product not found." },
        { status: 404 }
      );
    }
    if (!product.tryOnCompatible) {
      return NextResponse.json(
        { detail: "This product does not support virtual try-on." },
        { status: 422 }
      );
    }

    // ── Read person image bytes ──────────────────────────────────
    const personBytes = Buffer.from(await personFile.arrayBuffer());

    // ── Fetch the garment image from product URL ─────────────────
    let garmentBytes: Buffer;
    let garmentMimeType = "image/jpeg";
    try {
      const garmentRes = await fetch(product.images[0]);
      if (!garmentRes.ok) {
        throw new Error(`Failed to fetch garment image: ${garmentRes.status}`);
      }
      garmentBytes = Buffer.from(await garmentRes.arrayBuffer());
      const ct = garmentRes.headers.get("content-type");
      if (ct && ct.includes("png")) garmentMimeType = "image/png";
    } catch (err) {
      console.error("Failed to fetch garment image:", err);
      return NextResponse.json(
        { detail: "Could not load the product image for try-on." },
        { status: 500 }
      );
    }

    // ── Generate try-on images ───────────────────────────────────
    const apiKey = process.env.GOOGLE_API_KEY;
    let resultUrls: string[];

    if (!apiKey) {
      resultUrls = await generatePlaceholders(personBytes);
    } else {
      resultUrls = await generateWithGemini(
        apiKey,
        personBytes,
        personFile.type,
        garmentBytes,
        garmentMimeType,
        product.name,
        product.description,
      );
    }

    // ── Build response ───────────────────────────────────────────
    const resultId = randomUUID().replace(/-/g, "").slice(0, 16);

    return NextResponse.json({
      id: resultId,
      personImageUrl: resultUrls[0],
      productImageUrl: product.images[0],
      resultImageUrls: resultUrls,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Try-on error:", error);
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}

// ── Gemini Generation ──────────────────────────────────────────────

async function generateWithGemini(
  apiKey: string,
  personBytes: Buffer,
  personMimeType: string,
  garmentBytes: Buffer,
  garmentMimeType: string,
  productName: string,
  productDescription: string,
): Promise<string[]> {
  const ai = new GoogleGenAI({ apiKey });
  const model = process.env.GEMINI_MODEL || "gemini-3-pro-image-preview";

  const prompt = `You are an expert virtual try-on assistant. The first image is a photo of a person. The second image is a garment called "${productName}" — ${productDescription}.

Generate a photorealistic image of this exact person wearing this exact garment. Critical rules:
- Preserve the person's face, body shape, skin tone, hair, and pose EXACTLY
- The garment must match the second image precisely — same color, pattern, fabric texture, and style
- Make the garment fit naturally on the person's body with realistic draping, folds, and shadows
- Keep the person's original background
- Output ONLY the final photorealistic image, no text or labels`;

  const outputDir = join(process.cwd(), "public", "generated");
  await mkdir(outputDir, { recursive: true });

  const urls: string[] = [];

  for (let i = 0; i < TRYON_IMAGE_COUNT; i++) {
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: personMimeType as "image/jpeg" | "image/png",
                data: personBytes.toString("base64"),
              },
            },
            {
              inlineData: {
                mimeType: garmentMimeType as "image/jpeg" | "image/png",
                data: garmentBytes.toString("base64"),
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ["IMAGE", "TEXT"],
      },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          const fileId = randomUUID().replace(/-/g, "").slice(0, 12);
          const fileName = `tryon_${fileId}.png`;
          const filePath = join(outputDir, fileName);

          await writeFile(filePath, Buffer.from(part.inlineData.data, "base64"));
          urls.push(`/generated/${fileName}`);
          break;
        }
      }
    }
  }

  if (urls.length === 0) {
    throw new Error("Gemini returned no valid images.");
  }

  return urls;
}

// ── Placeholder Fallback ───────────────────────────────────────────

async function generatePlaceholders(personBytes: Buffer): Promise<string[]> {
  const outputDir = join(process.cwd(), "public", "generated");
  await mkdir(outputDir, { recursive: true });

  const urls: string[] = [];

  for (let i = 0; i < TRYON_IMAGE_COUNT; i++) {
    const fileId = randomUUID().replace(/-/g, "").slice(0, 12);
    const fileName = `tryon_${fileId}.jpg`;
    const filePath = join(outputDir, fileName);

    await writeFile(filePath, personBytes);
    urls.push(`/generated/${fileName}`);
  }

  return urls;
}
