import { AlertCircle } from "lucide-react";

export function StateMessage({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-6 text-center shadow-sm">
      <AlertCircle className="mx-auto mb-3 h-6 w-6 text-slate-500" aria-hidden="true" />
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">{message}</p>
    </div>
  );
}
