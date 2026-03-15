"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  Camera,
  Sparkles,
  Download,
  Share2,
  ShoppingBag,
  AlertCircle,
  X,
  Search,
  Check,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { ProductImage } from "@/components/product-image";
import { products, getProductById, formatPrice } from "@/lib/data";
import { useCartStore } from "@/store/cart-store";
import { useTryOnStore } from "@/store/try-on-store";
import type { Product, TryOnResult } from "@/types";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const UPLOAD_MAX_SIZE = 4 * 1024 * 1024; // 4MB — compress above this to stay within server limits
const MAX_DIMENSION = 2048; // max width/height after resize

/** Compress an image file using canvas if it exceeds UPLOAD_MAX_SIZE */
async function compressImage(file: File): Promise<File> {
  if (file.size <= UPLOAD_MAX_SIZE) return file;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      // Scale down if either dimension exceeds MAX_DIMENSION
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const scale = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));
      ctx.drawImage(img, 0, 0, width, height);

      // Try quality levels until under limit
      let quality = 0.85;
      const tryCompress = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Compression failed"));
            if (blob.size > UPLOAD_MAX_SIZE && quality > 0.3) {
              quality -= 0.15;
              tryCompress();
            } else {
              resolve(new File([blob], file.name, { type: "image/jpeg" }));
            }
          },
          "image/jpeg",
          quality,
        );
      };
      tryCompress();
    };
    img.onerror = () => reject(new Error("Failed to load image for compression"));
    img.src = URL.createObjectURL(file);
  });
}

type Stage = "setup" | "generating" | "result";

export function TryOnClient() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");

  const addToCart = useCartStore((s) => s.addItem);
  const addTryOnResult = useTryOnStore((s) => s.addResult);
  const tryOnHistory = useTryOnStore((s) => s.history);

  // ── State ────────────────────────────────────────────────────
  const [personImage, setPersonImage] = useState<File | null>(null);
  const [personPreview, setPersonPreview] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [stage, setStage] = useState<Stage>("setup");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<TryOnResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Pre-select product from query param
  useEffect(() => {
    if (productId) {
      const p = getProductById(productId);
      if (p?.tryOnCompatible) setSelectedProduct(p);
    }
  }, [productId]);

  // ── Photo Upload ─────────────────────────────────────────────
  const onDrop = useCallback((accepted: File[]) => {
    setError(null);
    const file = accepted[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setError("File must be under 10 MB.");
      return;
    }

    setPersonImage(file);
    const url = URL.createObjectURL(file);
    setPersonPreview(url);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [] },
    maxFiles: 1,
    multiple: false,
  });

  function clearPersonImage() {
    if (personPreview) URL.revokeObjectURL(personPreview);
    setPersonImage(null);
    setPersonPreview(null);
  }

  // ── Product Selector ─────────────────────────────────────────
  const tryOnProducts = products.filter((p) => p.tryOnCompatible);
  const filteredProducts = productSearch
    ? tryOnProducts.filter((p) =>
        p.name.toLowerCase().includes(productSearch.toLowerCase())
      )
    : tryOnProducts;

  // ── Generate ─────────────────────────────────────────────────
  async function handleGenerate() {
    if (!personImage || !selectedProduct) return;

    setStage("generating");
    setError(null);
    setProgress(0);

    // Simulate progress (in real app, use SSE or polling)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 500);

    try {
      // Compress large images to avoid 413 errors
      const imageToUpload = await compressImage(personImage);

      const formData = new FormData();
      formData.append("person_image", imageToUpload);
      formData.append("product_id", selectedProduct.id);

      const res = await fetch("/api/try-on", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(
          body?.detail ?? `Server error (${res.status})`
        );
      }

      const data: TryOnResult = await res.json();
      setResult(data);
      addTryOnResult(data);
      setStage("result");
    } catch (err) {
      clearInterval(progressInterval);
      // If the API isn't connected yet, show a demo result
      if (err instanceof TypeError && err.message.includes("fetch")) {
        const demoResult: TryOnResult = {
          id: `demo-${Date.now()}`,
          personImageUrl: personPreview ?? "",
          productImageUrl: selectedProduct.images[0],
          resultImageUrls: [
            personPreview ?? "",
            selectedProduct.images[0],
          ],
          createdAt: new Date().toISOString(),
        };
        setResult(demoResult);
        addTryOnResult(demoResult);
        setStage("result");
      } else {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
        setStage("setup");
      }
    }
  }

  function handleReset() {
    setStage("setup");
    setResult(null);
    setProgress(0);
  }

  // ── Download helper ──────────────────────────────────────────
  async function handleDownload(url: string, index: number) {
    try {
      const a = document.createElement("a");
      if (url.startsWith("data:")) {
        // Data URL — download directly
        a.href = url;
      } else {
        // Regular URL — fetch as blob
        const res = await fetch(url);
        const blob = await res.blob();
        a.href = URL.createObjectURL(blob);
      }
      a.download = `maison-elegance-tryon-${index + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      if (!url.startsWith("data:")) URL.revokeObjectURL(a.href);
    } catch {
      window.open(url, "_blank");
    }
  }

  // ── Share helper ─────────────────────────────────────────────
  async function handleShare(url: string) {
    if (url.startsWith("data:") && navigator.share) {
      // Convert data URL to blob for native share
      try {
        const res = await fetch(url);
        const blob = await res.blob();
        const file = new File([blob], "maison-elegance-tryon.jpg", { type: blob.type });
        await navigator.share({
          title: "My Virtual Try-On — Maison Élégance",
          text: "Check out how this looks on me!",
          files: [file],
        });
      } catch {
        // user cancelled or unsupported
      }
    } else if (navigator.share) {
      try {
        await navigator.share({
          title: "My Virtual Try-On — Maison Élégance",
          text: "Check out how this looks on me!",
          url,
        });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  }

  // ── Render helpers ───────────────────────────────────────────
  const canGenerate = personImage !== null && selectedProduct !== null;

  return (
    <div className="px-6 md:px-20 py-10 md:py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-xs font-medium text-brand-gold tracking-brand-wide mb-3">
          VIRTUAL FITTING ROOM
        </p>
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-brand-black mb-3">
          Try It On
        </h1>
        <p className="text-sm text-brand-black/50 max-w-md mx-auto leading-relaxed">
          Upload your photo, pick a garment, and see AI-generated results in
          seconds.
        </p>
      </div>

      {/* Error */}
      {error && (
        <Alert variant="destructive" className="mb-8 max-w-3xl mx-auto rounded-none">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* ── SETUP STAGE ─────────────────────────────────────── */}
      {stage === "setup" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Left Panel: Photo Upload */}
            <div className="border border-brand-black/10 p-6">
              <h2 className="text-[11px] font-semibold text-brand-black tracking-[3px] uppercase mb-5">
                YOUR PHOTO
              </h2>

              {personPreview ? (
                <div className="relative">
                  <div className="relative aspect-[3/4] bg-brand-black/5 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={personPreview}
                      alt="Your uploaded photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={clearPersonImage}
                    className="mt-4 flex items-center gap-2 text-xs font-medium text-brand-black/50 tracking-brand hover:text-brand-black transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    CHANGE PHOTO
                  </button>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className={`relative aspect-[3/4] border-2 border-dashed transition-colors cursor-pointer flex flex-col items-center justify-center gap-4 ${
                    isDragActive
                      ? "border-brand-gold bg-brand-gold/5"
                      : "border-brand-black/15 hover:border-brand-gold/50"
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="w-16 h-16 flex items-center justify-center bg-brand-black/5">
                    {isDragActive ? (
                      <Upload className="h-7 w-7 text-brand-gold" />
                    ) : (
                      <Camera className="h-7 w-7 text-brand-black/30" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-brand-black/70">
                      {isDragActive
                        ? "Drop your photo here"
                        : "Drag & drop your photo"}
                    </p>
                    <p className="text-xs text-brand-black/40 mt-1">
                      or click to browse · JPG, PNG · Max 10 MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel: Product Selector */}
            <div className="border border-brand-black/10 p-6">
              <h2 className="text-[11px] font-semibold text-brand-black tracking-[3px] uppercase mb-5">
                SELECT GARMENT
              </h2>

              {selectedProduct ? (
                <div className="relative">
                  <div className="relative aspect-[3/4] bg-brand-black/5 overflow-hidden">
                    <ProductImage
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="font-heading text-base font-semibold text-brand-black">
                        {selectedProduct.name}
                      </p>
                      <p className="text-sm text-brand-gold">
                        {formatPrice(selectedProduct.price)}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="flex items-center gap-2 text-xs font-medium text-brand-black/50 tracking-brand hover:text-brand-black transition-colors"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      CHANGE
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Search */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-black/30" />
                    <input
                      type="text"
                      placeholder="Search garments..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full h-10 pl-10 pr-4 border border-brand-black/15 bg-transparent text-sm text-brand-black placeholder:text-brand-black/30 outline-none focus:border-brand-gold transition-colors"
                    />
                    {productSearch && (
                      <button
                        onClick={() => setProductSearch("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <X className="h-3.5 w-3.5 text-brand-black/30" />
                      </button>
                    )}
                  </div>

                  {/* Product grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[520px] overflow-y-auto pr-1">
                    {filteredProducts.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedProduct(p)}
                        className="group text-left"
                      >
                        <div className="relative aspect-[3/4] bg-brand-black/5 overflow-hidden mb-2">
                          <ProductImage
                            src={p.images[0]}
                            alt={p.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="120px"
                          />
                        </div>
                        <p className="text-xs font-medium text-brand-black truncate">
                          {p.name}
                        </p>
                        <p className="text-[11px] text-brand-gold">
                          {formatPrice(p.price)}
                        </p>
                      </button>
                    ))}

                    {filteredProducts.length === 0 && (
                      <p className="col-span-full text-center text-sm text-brand-black/30 py-10">
                        No garments found.
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-center mt-10">
            <Button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="h-14 px-14 rounded-none bg-brand-gold text-brand-black text-sm font-semibold tracking-brand hover:bg-brand-gold-hover disabled:bg-brand-black/10 disabled:text-brand-black/30"
            >
              <Sparkles className="h-4 w-4" />
              GENERATE TRY-ON
            </Button>
          </div>

          {!canGenerate && (
            <p className="text-center text-xs text-brand-black/30 mt-3">
              {!personImage && !selectedProduct
                ? "Upload a photo and select a garment to begin"
                : !personImage
                  ? "Upload your photo to continue"
                  : "Select a garment to continue"}
            </p>
          )}
        </>
      )}

      {/* ── GENERATING STAGE ────────────────────────────────── */}
      {stage === "generating" && (
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            <Skeleton className="aspect-[3/4] rounded-none bg-brand-black/5" />
            <Skeleton className="aspect-[3/4] rounded-none bg-brand-black/5" />
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-brand-gold animate-pulse" />
              <p className="text-sm font-medium text-brand-black">
                AI is dressing you up...
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-xs h-1 bg-brand-black/10 overflow-hidden">
              <div
                className="h-full bg-brand-gold transition-all duration-500 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>

            <p className="text-xs text-brand-black/30">
              This usually takes 10–30 seconds
            </p>
          </div>
        </div>
      )}

      {/* ── RESULT STAGE ────────────────────────────────────── */}
      {stage === "result" && result && (
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-brand-gold/10 px-4 py-2 mb-4">
              <Check className="h-4 w-4 text-brand-gold" />
              <span className="text-xs font-medium text-brand-gold tracking-brand">
                TRY-ON COMPLETE
              </span>
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-brand-black">
              Here&apos;s How It Looks
            </h2>
          </div>

          {/* Result images grid */}
          <div
            className={`grid gap-6 mb-10 ${
              result.resultImageUrls.length === 1
                ? "grid-cols-1 max-w-lg mx-auto"
                : result.resultImageUrls.length === 2
                  ? "grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"
            }`}
          >
            {result.resultImageUrls.map((url, i) => (
              <Card
                key={i}
                className="border-0 ring-0 bg-transparent p-0 rounded-none overflow-visible"
              >
                <CardContent className="p-0">
                  <div className="relative aspect-[3/4] bg-brand-black/5 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Try-on result ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleDownload(url, i)}
                      className="flex items-center gap-1.5 px-3 py-2 border border-brand-black/15 text-xs font-medium text-brand-black/60 tracking-brand hover:border-brand-black/30 transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" />
                      DOWNLOAD
                    </button>
                    <button
                      onClick={() => handleShare(url)}
                      className="flex items-center gap-1.5 px-3 py-2 border border-brand-black/15 text-xs font-medium text-brand-black/60 tracking-brand hover:border-brand-black/30 transition-colors"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      SHARE
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {selectedProduct && (
              <Button
                onClick={() => {
                  if (selectedProduct.sizes.length > 0) {
                    addToCart(
                      selectedProduct,
                      selectedProduct.sizes[0],
                      selectedProduct.colors[0],
                      result?.resultImageUrls[0],
                    );
                  }
                }}
                className="h-12 px-10 rounded-none bg-brand-black text-brand-offwhite text-sm font-semibold tracking-brand hover:bg-brand-black/90"
              >
                <ShoppingBag className="h-4 w-4" />
                ADD TO CART
              </Button>
            )}
            <Button
              onClick={handleReset}
              className="h-12 px-10 rounded-none bg-brand-gold text-brand-black text-sm font-semibold tracking-brand hover:bg-brand-gold-hover"
            >
              <RotateCcw className="h-4 w-4" />
              TRY ANOTHER
            </Button>
          </div>
        </div>
      )}

      {/* ── History ──────────────────────────────────────────── */}
      {stage === "setup" && tryOnHistory.length > 0 && (
        <section className="mt-20 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[11px] font-semibold text-brand-gold tracking-[3px] uppercase">
              RECENT TRY-ONS
            </h3>
            <button
              onClick={() => useTryOnStore.getState().clearHistory()}
              className="text-xs text-brand-black/30 hover:text-brand-black/50 transition-colors"
            >
              Clear all
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {tryOnHistory.slice(0, 8).map((item) => {
              const thumbnail = item.resultImageUrls?.[0] || item.productImageUrl;
              return (
                <div key={item.id} className="relative aspect-[3/4] bg-brand-black/5 overflow-hidden">
                  {thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumbnail}
                      alt="Previous try-on"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-black/20 text-xs">
                      No preview
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-brand-black/60 to-transparent p-3">
                    <p className="text-[10px] text-brand-offwhite/70">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
