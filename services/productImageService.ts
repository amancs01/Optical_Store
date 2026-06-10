import { requireSupabase } from "@/lib/supabase/client";
import { uploadProductGalleryImage } from "@/services/uploadService";
import type { ProductImage } from "@/types/product";

export async function getProductImages(productId: string) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", productId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data || []) as ProductImage[];
}

export async function addProductImages(productId: string, files: File[], altText?: string) {
  if (!files.length) return [];

  const existingImages = await getProductImages(productId);
  const uploaded: Array<{ image_url: string; sort_order: number; alt_text: string | null; product_id: string; is_primary: boolean }> = [];

  for (const [index, file] of files.entries()) {
    const imageUrl = await uploadProductGalleryImage(file, productId);
    uploaded.push({
      product_id: productId,
      image_url: imageUrl,
      alt_text: altText || null,
      sort_order: existingImages.length + index,
      is_primary: false,
    });
  }

  const supabase = requireSupabase();
  const { data, error } = await supabase.from("product_images").insert(uploaded).select();
  if (error) throw error;
  return (data || []) as ProductImage[];
}

export async function deleteProductImage(imageId: string) {
  const supabase = requireSupabase();
  const { error } = await supabase.from("product_images").delete().eq("id", imageId);
  if (error) throw error;
}

export async function updateProductImageOrder(productId: string, orderedImages: ProductImage[]) {
  const supabase = requireSupabase();

  for (const [index, image] of orderedImages.entries()) {
    const { error } = await supabase
      .from("product_images")
      .update({ sort_order: index })
      .eq("id", image.id)
      .eq("product_id", productId);

    if (error) throw error;
  }

  return getProductImages(productId);
}

export async function setPrimaryProductImage(productId: string, imageId: string) {
  const supabase = requireSupabase();
  const images = await getProductImages(productId);
  const primaryImage = images.find((image) => image.id === imageId);

  if (!primaryImage) throw new Error("Product image could not be found.");

  const { error: clearError } = await supabase
    .from("product_images")
    .update({ is_primary: false })
    .eq("product_id", productId);

  if (clearError) throw clearError;

  const { error: primaryError } = await supabase
    .from("product_images")
    .update({ is_primary: true })
    .eq("id", imageId)
    .eq("product_id", productId);

  if (primaryError) throw primaryError;

  const { error: productError } = await supabase
    .from("products")
    .update({ image_url: primaryImage.image_url, updated_at: new Date().toISOString() })
    .eq("id", productId);

  if (productError) throw productError;

  return primaryImage.image_url;
}
