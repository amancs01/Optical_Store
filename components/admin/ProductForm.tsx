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
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "");
    let imageUrl = String(form.get("image_url") || "");
    const image = form.get("image") as File | null;

    try {
      if (image && image.size > 0) {
        imageUrl = await uploadProductImage(image, name);
      }

      const payload = {
        name,
        slug: String(form.get("slug") || slugify(name)),
        description: String(form.get("description") || ""),
        brand: String(form.get("brand") || ""),
        category: String(form.get("category") || ""),
        gender: String(form.get("gender") || ""),
        frame_type: String(form.get("frame_type") || ""),
        shape: String(form.get("shape") || ""),
        material: String(form.get("material") || ""),
        color: String(form.get("color") || ""),
        price: Number(form.get("price") || 0),
        discount_price: form.get("discount_price") ? Number(form.get("discount_price")) : null,
        stock_quantity: Number(form.get("stock_quantity") || 0),
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
        <Field name="name" label="Product name" defaultValue={product?.name} required />
        <Field name="slug" label="Slug" defaultValue={product?.slug} />
        <Field name="brand" label="Brand" defaultValue={product?.brand || ""} />
        <Select name="category" label="Category" options={CATEGORIES} defaultValue={product?.category || ""} />
        <Select name="gender" label="Gender" options={GENDERS} defaultValue={product?.gender || ""} />
        <Select name="frame_type" label="Frame type" options={FRAME_TYPES} defaultValue={product?.frame_type || ""} />
        <Field name="shape" label="Shape" defaultValue={product?.shape || ""} />
        <Field name="material" label="Material" defaultValue={product?.material || ""} />
        <Field name="color" label="Color" defaultValue={product?.color || ""} />
        <Field name="price" label="Price" type="number" defaultValue={product?.price || 0} required />
        <Field name="discount_price" label="Discount price" type="number" defaultValue={product?.discount_price || ""} />
        <Field name="stock_quantity" label="Stock quantity" type="number" defaultValue={product?.stock_quantity || 0} />
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

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  const { label, ...inputProps } = props;
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      {label}
      <input className="rounded-md border border-slate-200 px-3 py-2 font-normal" {...inputProps} />
    </label>
  );
}

function Select({
  label,
  name,
  options,
  defaultValue,
}: {
  label: string;
  name: string;
  options: string[];
  defaultValue: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      {label}
      <select name={name} defaultValue={defaultValue} className="rounded-md border border-slate-200 px-3 py-2 font-normal">
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
