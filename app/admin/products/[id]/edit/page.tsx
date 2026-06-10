"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductForm } from "@/components/admin/ProductForm";
import { Spinner } from "@/components/ui/Spinner";
import { StateMessage } from "@/components/ui/StateMessage";
import { getProductById } from "@/services/productService";
import type { Product } from "@/types/product";
import { useAdminStatus } from "@/lib/auth/admin";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");
  const { isAdmin } = useAdminStatus();

  useEffect(() => {
    if (!isAdmin) return;
    params
      .then(({ id }) => getProductById(id).then(setProduct))
      .catch((err) => setError(err instanceof Error ? err.message : "Product could not load."));
  }, [isAdmin, params]);

  return (
    <AdminLayout>
      <h1 className="mb-5 text-3xl font-black">Edit product</h1>
      {error ? <StateMessage title="Product could not load" message={error} /> : product ? <ProductForm product={product} /> : <div className="flex min-h-[40vh] items-center justify-center"><Spinner size="lg" /></div>}
    </AdminLayout>
  );
}
