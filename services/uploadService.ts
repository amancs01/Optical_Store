import { requireSupabase } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";

export async function uploadProductImage(file: File, productName: string) {
  const supabase = requireSupabase();
  const extension = file.name.split(".").pop() || "jpg";
  const path = `${slugify(productName)}-${Date.now()}.${extension}`;

  const { error } = await supabase.storage.from("product-images").upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (error) throw error;

  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}
