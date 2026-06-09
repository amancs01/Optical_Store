import { Suspense } from "react";
import { ProductGridSkeleton } from "@/components/ui/LoadingSkeletons";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getActiveProducts } from "@/services/productService";
import ProductsContent from "./products-content";

export default async function ProductsPage() {
  let products: Awaited<ReturnType<typeof getActiveProducts>> = [];
  let error = "";

  if (isSupabaseConfigured) {
    try {
      products = await getActiveProducts();
    } catch (err) {
      error = err instanceof Error ? err.message : "Could not load products.";
    }
  } else {
    error = "Supabase is not configured. Add the public Supabase environment variables and run the schema to load products.";
  }

  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <ProductsContent products={products} error={error} />
    </Suspense>
  );
}
