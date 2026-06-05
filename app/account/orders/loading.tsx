import { ListSkeleton } from "@/components/ui/LoadingSkeletons";

export default function AccountOrdersLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 h-9 w-44 animate-pulse rounded bg-slate-100" />
      <ListSkeleton rows={4} />
    </div>
  );
}
