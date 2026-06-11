"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductForm } from "@/components/admin/ProductForm";
import { FormSkeleton } from "@/components/ui/LoadingSkeletons";
import { StateMessage } from "@/components/ui/StateMessage";
import { getProductById } from "@/services/productService";
import type { Product } from "@/types/product";
import { useCurrentUser } from "@/lib/auth/admin";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");
  const { isAdmin } = useCurrentUser();

  useEffect(() => {
    if (!isAdmin) return;
    params
      .then(({ id }) => getProductById(id).then(setProduct))
      .catch((err) => setError(err instanceof Error ? err.message : "Product could not load."));
  }, [isAdmin, params]);

  return (
    <AdminLayout>
      <div className="w-full max-w-full overflow-hidden">
        <h1 className="mb-4 text-3xl font-black tracking-tight md:mb-5 md:text-5xl">Edit product</h1>
        {error ? <StateMessage title="Product could not load" message={error} /> : product ? <ProductForm product={product} /> : <FormSkeleton />}
      </div>
    </AdminLayout>
  );
}
