"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CATEGORIES, FRAME_TYPES, GENDERS } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import { saveProduct, updateProduct } from "@/services/productService";
import { addProductImages, deleteProductImage, setPrimaryProductImage, updateProductImageOrder } from "@/services/productImageService";
import { uploadProductImage } from "@/services/uploadService";
import type { Product, ProductImage } from "@/types/product";

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [nameValue, setNameValue] = useState(product?.name || "");
  const [slugValue, setSlugValue] = useState(product?.slug || "");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<"name" | "slug" | "category" | "price" | "stock_quantity", string>>>({});
  const [saving, setSaving] = useState(false);
  const [mainImageUrl, setMainImageUrl] = useState(product?.image_url || "");
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryImages, setGalleryImages] = useState<ProductImage[]>(product?.images || []);
  const galleryPreviews = useMemo(
    () => galleryFiles.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [galleryFiles],
  );

  useEffect(() => {
    return () => {
      galleryPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [galleryPreviews]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    const form = new FormData(event.currentTarget);
    const name = nameValue.trim();
    const slug = slugValue.trim() || slugify(name);
    const category = String(form.get("category") || "");
    const price = Number(form.get("price") || 0);
    const stockQuantity = Number(form.get("stock_quantity") || 0);
    const validationErrors: Partial<Record<"name" | "slug" | "category" | "price" | "stock_quantity", string>> = {};

    if (!name) validationErrors.name = "Enter a product name.";
    if (!slug) validationErrors.slug = "Enter a product slug.";
    if (slug && slug !== slugify(slug)) validationErrors.slug = "Use a URL-safe slug without slashes or spaces.";
    if (!category) validationErrors.category = "Choose a product category.";
    if (!Number.isFinite(price) || price <= 0) validationErrors.price = "Enter a price greater than 0.";
    if (!Number.isFinite(stockQuantity) || stockQuantity < 0) validationErrors.stock_quantity = "Stock cannot be negative.";

    setFieldErrors(validationErrors);
    if (Object.keys(validationErrors).length) {
      setStatus("Please fix the highlighted product details.");
      return;
    }

    setSaving(true);
    let imageUrl = String(form.get("image_url") || "");
    const image = form.get("image") as File | null;

    try {
      const payload = {
        name,
        slug,
        description: String(form.get("description") || ""),
        brand: String(form.get("brand") || ""),
        category,
        gender: String(form.get("gender") || ""),
        frame_type: String(form.get("frame_type") || ""),
        shape: String(form.get("shape") || ""),
        material: String(form.get("material") || ""),
        color: String(form.get("color") || ""),
        price,
        discount_price: form.get("discount_price") ? Number(form.get("discount_price")) : null,
        stock_quantity: stockQuantity,
        image_url: imageUrl || null,
        is_active: form.get("is_active") === "on",
        is_featured: form.get("is_featured") === "on",
      };

      if (product) {
        if (image && image.size > 0) {
          imageUrl = await uploadProductImage(image, name);
          payload.image_url = imageUrl || null;
        }

        await updateProduct(product.id, payload);
        if (galleryFiles.length) await addProductImages(product.id, galleryFiles, name);
      } else {
        const createdProduct = await saveProduct(payload);

        if (image && image.size > 0) {
          imageUrl = await uploadProductImage(image, name);
          await updateProduct(createdProduct.id, { image_url: imageUrl || null });
        }

        if (galleryFiles.length) await addProductImages(createdProduct.id, galleryFiles, name);
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not save product.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid w-full max-w-full gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:gap-6 md:p-8">
      {status ? <p className="w-full max-w-full rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{status}</p> : null}
      <div className="grid w-full max-w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <Field
          name="name"
          label="Product name"
          value={nameValue}
          onChange={(event) => {
            const nextName = event.target.value;
            setNameValue(nextName);
            if (!product) setSlugValue(slugify(nextName));
          }}
          required
          error={fieldErrors.name}
        />
        <Field
          name="slug"
          label="Slug"
          value={slugValue}
          onChange={(event) => setSlugValue(slugify(event.target.value))}
          readOnly={!product}
          error={fieldErrors.slug}
          helper={product ? "Edit only when you intentionally need to change the public product URL." : "Generated from the product name."}
        />
        <Field name="brand" label="Brand" defaultValue={product?.brand || ""} />
        <Select name="category" label="Category" options={CATEGORIES} defaultValue={product?.category || ""} error={fieldErrors.category} />
        <Select name="gender" label="Gender" options={GENDERS} defaultValue={product?.gender || ""} />
        <Select name="frame_type" label="Frame type" options={FRAME_TYPES} defaultValue={product?.frame_type || ""} />
        <Field name="shape" label="Shape" defaultValue={product?.shape || ""} />
        <Field name="material" label="Material" defaultValue={product?.material || ""} />
        <Field name="color" label="Color" defaultValue={product?.color || ""} />
        <Field name="price" label="Price" type="number" min={1} defaultValue={product?.price || 0} required error={fieldErrors.price} />
        <Field name="discount_price" label="Discount price" type="number" defaultValue={product?.discount_price || ""} />
        <Field name="stock_quantity" label="Stock quantity" type="number" min={0} defaultValue={product?.stock_quantity || 0} error={fieldErrors.stock_quantity} />
      </div>
      <label className="grid w-full max-w-full gap-2 text-sm font-semibold text-slate-700">
        Description
        <textarea name="description" defaultValue={product?.description || ""} rows={4} className="box-border min-h-[120px] w-full max-w-full rounded-lg border border-slate-200 px-3 py-2 text-base font-normal focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 md:rounded-md md:text-sm" />
      </label>
      <Field name="image_url" label="Image URL" value={mainImageUrl} onChange={(event) => setMainImageUrl(event.target.value)} />
      <label className="grid w-full max-w-full gap-2 text-sm font-semibold text-slate-700">
        Upload image
        <input name="image" type="file" accept="image/*" className="box-border w-full max-w-full rounded-lg border border-slate-200 px-3 py-2 text-base font-normal file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-slate-700 md:rounded-md md:text-sm" />
      </label>
      <section className="grid w-full max-w-full gap-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3 md:rounded-md">
        <div>
          <h2 className="text-sm font-semibold text-slate-700">Gallery images</h2>
          <p className="mt-1 text-xs text-slate-500">Upload side angle, close-up, and lifestyle images.</p>
        </div>
        {galleryImages.length ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:flex md:flex-wrap md:gap-3">
            {galleryImages.map((image, index) => (
              <div key={image.id} className="min-w-0 rounded-lg border border-slate-200 bg-white p-2 md:w-28 md:rounded-md">
                <img src={image.image_url} alt={image.alt_text || nameValue || "Product gallery image"} className="h-20 w-full rounded-md object-cover" />
                <div className="mt-2 grid gap-1">
                  <button type="button" onClick={() => void makePrimary(image)} className="rounded-md border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50">
                    {image.is_primary || image.image_url === mainImageUrl ? "Primary" : "Set primary"}
                  </button>
                  <div className="grid grid-cols-2 gap-1">
                    <button type="button" onClick={() => void moveGalleryImage(index, -1)} disabled={index === 0} className="rounded-md border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700 disabled:opacity-40">
                      Up
                    </button>
                    <button type="button" onClick={() => void moveGalleryImage(index, 1)} disabled={index === galleryImages.length - 1} className="rounded-md border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700 disabled:opacity-40">
                      Down
                    </button>
                  </div>
                  <button type="button" onClick={() => void removeGalleryImage(image)} className="rounded-md bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-100">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : product ? (
          <p className="text-xs text-slate-500">No gallery images yet.</p>
        ) : null}
        <label className="grid w-full max-w-full gap-2 text-sm font-semibold text-slate-700">
          Add gallery images
          <input
            type="file"
            multiple
            accept="image/*"
            className="box-border w-full max-w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base font-normal file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-slate-700 md:rounded-md md:text-sm"
            onChange={(event) => {
              const files = Array.from(event.target.files || []);
              setGalleryFiles((current) => [...current, ...files]);
              event.target.value = "";
            }}
          />
        </label>
        {galleryPreviews.length ? (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:flex md:flex-wrap md:gap-3">
            {galleryPreviews.map((preview, index) => (
              <div key={`${preview.file.name}-${index}`} className="min-w-0 rounded-lg border border-slate-200 bg-white p-2 md:w-24 md:rounded-md">
                <img src={preview.url} alt="" className="h-16 w-full rounded-md object-cover" />
                <button type="button" onClick={() => removeSelectedGalleryFile(index)} className="mt-2 w-full rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-200">
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </section>
      <div className="flex flex-wrap gap-3 text-sm font-semibold text-slate-700">
        <label className="flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
          <input name="is_active" type="checkbox" defaultChecked={product?.is_active ?? true} className="h-4 w-4" /> Active
        </label>
        <label className="flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
          <input name="is_featured" type="checkbox" defaultChecked={product?.is_featured ?? false} className="h-4 w-4" /> Featured
        </label>
      </div>
      <Button disabled={saving} className="min-h-12 w-full md:w-fit">{saving ? "Saving..." : "Save Product"}</Button>
    </form>
  );

  async function removeGalleryImage(image: ProductImage) {
    setStatus("");
    try {
      await deleteProductImage(image.id);
      setGalleryImages((current) => current.filter((item) => item.id !== image.id));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not delete gallery image.");
    }
  }

  async function makePrimary(image: ProductImage) {
    if (!product) return;
    setStatus("");
    try {
      const imageUrl = await setPrimaryProductImage(product.id, image.id);
      setMainImageUrl(imageUrl);
      setGalleryImages((current) => current.map((item) => ({ ...item, is_primary: item.id === image.id })));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not set primary image.");
    }
  }

  async function moveGalleryImage(index: number, direction: -1 | 1) {
    if (!product) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= galleryImages.length) return;

    const orderedImages = [...galleryImages];
    const [moved] = orderedImages.splice(index, 1);
    orderedImages.splice(targetIndex, 0, moved);
    setGalleryImages(orderedImages);

    try {
      const updatedImages = await updateProductImageOrder(product.id, orderedImages);
      setGalleryImages(updatedImages);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not update image order.");
      setGalleryImages(galleryImages);
    }
  }

  function removeSelectedGalleryFile(index: number) {
    setGalleryFiles((current) => current.filter((_, fileIndex) => fileIndex !== index));
  }
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string; error?: string; helper?: string }) {
  const { label, error, helper, ...inputProps } = props;
  return (
    <label className="grid w-full max-w-full gap-2 text-sm font-semibold text-slate-700">
      {label}
      <input className="box-border h-11 w-full max-w-full rounded-lg border border-slate-200 px-3 text-base font-normal focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 md:rounded-md md:text-sm" aria-invalid={Boolean(error)} {...inputProps} />
      {helper ? <span className="text-xs font-medium text-slate-500">{helper}</span> : null}
      {error ? <span className="text-xs font-semibold text-rose-700">{error}</span> : null}
    </label>
  );
}

function Select({
  label,
  name,
  options,
  defaultValue,
  error,
}: {
  label: string;
  name: string;
  options: string[];
  defaultValue: string;
  error?: string;
}) {
  return (
    <label className="grid w-full max-w-full gap-2 text-sm font-semibold text-slate-700">
      {label}
      <select name={name} defaultValue={defaultValue} aria-invalid={Boolean(error)} className="box-border h-11 w-full max-w-full rounded-lg border border-slate-200 px-3 text-base font-normal focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 md:rounded-md md:text-sm">
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? <span className="text-xs font-semibold text-rose-700">{error}</span> : null}
    </label>
  );
}
