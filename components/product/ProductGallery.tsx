"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Glasses } from "lucide-react";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

type ProductWithGalleryFields = Product & {
  images?: unknown;
  gallery_images?: unknown;
  image_urls?: unknown;
  additional_images?: unknown;
};

export function ProductGallery({ product }: { product: Product }) {
  const images = useMemo(() => getProductImages(product as ProductWithGalleryFields), [product]);
  const [selectedImage, setSelectedImage] = useState(images[0] || null);

  return (
    <div className="overflow-hidden rounded-md border border-emerald-100 bg-emerald-50 p-2 shadow-sm sm:p-3">
      <div className="group relative aspect-square overflow-hidden rounded-md bg-white">
        {selectedImage ? (
          <Image
            src={selectedImage}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        ) : (
          <ProductGalleryFallback name={product.name} />
        )}
      </div>
      {images.length ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelectedImage(image)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-white transition hover:border-emerald-300 sm:h-18 sm:w-18",
                selectedImage === image ? "border-emerald-600 ring-2 ring-emerald-100" : "border-slate-200",
              )}
              aria-label={`View ${product.name} image ${index + 1}`}
            >
              <Image src={image} alt="" fill className="object-cover" sizes="72px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function getProductImages(product: ProductWithGalleryFields) {
  const candidates = [
    product.image_url,
    ...readGalleryField(product.images),
    ...readGalleryField(product.gallery_images),
    ...readGalleryField(product.image_urls),
    ...readGalleryField(product.additional_images),
  ];

  return Array.from(new Set(candidates.filter(isUsableImageUrl)));
}

function readGalleryField(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];

    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed: unknown = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    return [trimmed];
  }

  return [];
}

function isUsableImageUrl(value: unknown): value is string {
  return typeof value === "string" && (value.startsWith("/") || value.startsWith("http://") || value.startsWith("https://"));
}

function ProductGalleryFallback({ name }: { name: string }) {
  return (
    <div className="grid h-full place-items-center bg-[linear-gradient(135deg,#064e3b,#059669_55%,#d1fae5)] p-4 text-center text-white">
      <div>
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white/15 ring-1 ring-white/30 sm:h-14 sm:w-14">
          <Glasses className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
        </div>
        <p className="mt-3 text-[10px] font-bold uppercase tracking-wide text-emerald-50">Titan Optical</p>
        <p className="mt-1 line-clamp-2 text-sm font-semibold text-white/90">{name}</p>
      </div>
    </div>
  );
}
