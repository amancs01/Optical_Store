"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductForm } from "@/components/admin/ProductForm";
import { StateMessage } from "@/components/ui/StateMessage";
import { getProductById } from "@/services/productService";
import type { Product } from "@/types/product";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    params
      .then(({ id }) => getProductById(id).then(setProduct))
      .catch((err) => setError(err instanceof Error ? err.message : "Product could not load."));
  }, [params]);

  return (
    <AdminLayout>
      <h1 className="mb-5 text-3xl font-black">Edit product</h1>
      {error ? <StateMessage title="Product could not load" message={error} /> : product ? <ProductForm product={product} /> : <p>Loading product...</p>}
    </AdminLayout>
  );
}
