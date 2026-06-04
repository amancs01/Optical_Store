import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return <AdminLayout><h1 className="mb-5 text-3xl font-black">Add product</h1><ProductForm /></AdminLayout>;
}
