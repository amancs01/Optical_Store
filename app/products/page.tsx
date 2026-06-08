import { Suspense } from "react";
import { ProductGridSkeleton } from "@/components/ui/LoadingSkeletons";
import ProductsContent from "./products-content";

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <ProductsContent />
    </Suspense>
  );
}
