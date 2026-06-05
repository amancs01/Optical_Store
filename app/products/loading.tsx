import { ProductGridSkeleton } from "@/components/ui/LoadingSkeletons";

export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="h-10 w-56 animate-pulse rounded bg-slate-100" />
        <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-slate-100" />
      </div>
      <div className="mb-6 h-20 animate-pulse rounded-md bg-slate-100" />
      <ProductGridSkeleton />
    </div>
  );
}
