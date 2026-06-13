import { requireSupabase } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import type { Product } from "@/types/product";
import { getProductImages } from "@/services/productImageService";

const productSelect = "*";

export type DeleteProductResult = {
  archived: boolean;
  data: Product | null;
};

export async function getActiveProducts() {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as Product[];
}

export async function getFeaturedProducts(limit = 10) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as Product[];
}

export async function getProductBySlug(slug: string) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) throw error;
  const product = data as Product;
  const images = await getProductImages(product.id);
  return { ...product, images };
}

export async function getSimilarProducts(category: string | null, currentId: string) {
  if (!category) return [];
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("is_active", true)
    .eq("category", category)
    .neq("id", currentId)
    .limit(4);

  if (error) throw error;
  return (data || []) as Product[];
}

export async function getAllProductsForAdmin() {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as Product[];
}

export async function getProductById(id: string) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from("products").select(productSelect).eq("id", id).single();

  if (error) throw error;
  const product = data as Product;
  const images = await getProductImages(product.id);
  return { ...product, images };
}

export async function saveProduct(input: Partial<Product>) {
  const supabase = requireSupabase();
  const payload = {
    ...input,
    slug: input.slug || slugify(input.name || "product"),
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from("products").insert(payload).select().single();

  if (error) throw error;
  return data as Product;
}

export async function updateProduct(id: string, input: Partial<Product>) {
  const supabase = requireSupabase();
  const payload = {
    ...input,
    slug: input.slug || (input.name ? slugify(input.name) : undefined),
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from("products").update(payload).eq("id", id).select().single();

  if (error) throw error;
  return data as Product;
}

export async function deleteProduct(id: string) {
  const supabase = requireSupabase();
  console.log("Attempting delete/archive for product:", id);

  const { data, error } = await supabase
    .from("products")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  console.log("Delete/archive result:", { data, error });

  if (error) {
    console.error("Product delete/archive failed:", error);
    throw error;
  }

  return { archived: true, data: data as Product | null };
}
