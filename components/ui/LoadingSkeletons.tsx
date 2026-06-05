export function ProductGridSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading products">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="aspect-[4/3] animate-pulse bg-[#f0ebe2]" />
          <div className="grid gap-3 p-4">
            <div className="h-3 w-24 animate-pulse rounded bg-[#f0ebe2]" />
            <div className="h-5 w-4/5 animate-pulse rounded bg-[#f0ebe2]" />
            <div className="flex items-center justify-between">
              <div className="h-5 w-20 animate-pulse rounded bg-[#f0ebe2]" />
              <div className="h-3 w-16 animate-pulse rounded bg-[#f0ebe2]" />
            </div>
            <div className="h-11 animate-pulse rounded-md bg-[#f0ebe2]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="grid gap-3" aria-label="Loading list">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="rounded-md border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap justify-between gap-4">
            <div className="grid flex-1 gap-3">
              <div className="h-5 w-40 animate-pulse rounded bg-slate-100" />
              <div className="h-3 w-64 max-w-full animate-pulse rounded bg-slate-100" />
              <div className="h-3 w-48 max-w-full animate-pulse rounded bg-slate-100" />
            </div>
            <div className="h-10 w-32 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="aspect-[4/3] animate-pulse rounded-md bg-slate-100" />
      <div className="grid content-start gap-4">
        <div className="h-3 w-28 animate-pulse rounded bg-slate-100" />
        <div className="h-10 w-3/4 animate-pulse rounded bg-slate-100" />
        <div className="h-7 w-32 animate-pulse rounded bg-slate-100" />
        <div className="h-24 animate-pulse rounded bg-slate-100" />
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-md bg-slate-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
