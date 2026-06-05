"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CATEGORIES, FRAME_TYPES, GENDERS } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import { saveProduct, updateProduct } from "@/services/productService";
import { uploadProductImage } from "@/services/uploadService";
import type { Product } from "@/types/product";

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [nameValue, setNameValue] = useState(product?.name || "");
  const [slugValue, setSlugValue] = useState(product?.slug || "");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<"name" | "slug" | "category" | "price" | "stock_quantity", string>>>({});
  const [saving, setSaving] = useState(false);

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
      if (image && image.size > 0) {
        imageUrl = await uploadProductImage(image, name);
      }

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

      if (product) await updateProduct(product.id, payload);
      else await saveProduct(payload);
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not save product.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-md border border-slate-200 bg-white p-5">
      {status ? <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">{status}</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
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
      <label className="grid gap-2 text-sm font-semibold text-slate-700">
        Description
        <textarea name="description" defaultValue={product?.description || ""} rows={4} className="rounded-md border border-slate-200 px-3 py-2 font-normal" />
      </label>
      <Field name="image_url" label="Image URL" defaultValue={product?.image_url || ""} />
      <label className="grid gap-2 text-sm font-semibold text-slate-700">
        Upload image
        <input name="image" type="file" accept="image/*" className="rounded-md border border-slate-200 px-3 py-2 font-normal" />
      </label>
      <div className="flex flex-wrap gap-4 text-sm font-semibold text-slate-700">
        <label className="flex items-center gap-2">
          <input name="is_active" type="checkbox" defaultChecked={product?.is_active ?? true} /> Active
        </label>
        <label className="flex items-center gap-2">
          <input name="is_featured" type="checkbox" defaultChecked={product?.is_featured ?? false} /> Featured
        </label>
      </div>
      <Button disabled={saving}>{saving ? "Saving..." : "Save Product"}</Button>
    </form>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string; error?: string; helper?: string }) {
  const { label, error, helper, ...inputProps } = props;
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      {label}
      <input className="rounded-md border border-slate-200 px-3 py-2 font-normal focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100" aria-invalid={Boolean(error)} {...inputProps} />
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
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      {label}
      <select name={name} defaultValue={defaultValue} aria-invalid={Boolean(error)} className="rounded-md border border-slate-200 px-3 py-2 font-normal focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100">
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
