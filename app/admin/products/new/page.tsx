import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <AdminLayout>
      <div className="w-full max-w-full overflow-hidden">
        <h1 className="mb-4 text-3xl font-black tracking-tight md:mb-5 md:text-5xl">Add product</h1>
        <ProductForm />
      </div>
    </AdminLayout>
  );
}
