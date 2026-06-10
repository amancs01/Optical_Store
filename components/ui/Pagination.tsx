import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <nav className="mt-5 flex items-center justify-center gap-1" aria-label="Pagination">
      <button
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-sm text-slate-400">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-sm font-semibold transition ${
              page === currentPage
                ? "bg-emerald-700 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {page}
          </button>
        ),
      )}
      <button
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
