import { requireSupabase } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import type { Product } from "@/types/product";

const productSelect = "*";

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

export async function getFeaturedProducts() {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("is_active", true)
    .eq("is_featured", true)
    .limit(6);

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
  return data as Product;
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
  return data as Product;
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
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}
