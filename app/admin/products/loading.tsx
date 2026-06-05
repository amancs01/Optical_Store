import { AdminLayout } from "@/components/admin/AdminLayout";
import { ListSkeleton } from "@/components/ui/LoadingSkeletons";

export default function AdminProductsLoading() {
  return (
    <AdminLayout>
      <div className="mb-6 h-9 w-40 animate-pulse rounded bg-slate-100" />
      <ListSkeleton rows={5} />
    </AdminLayout>
  );
}
