"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ListSkeleton } from "@/components/ui/LoadingSkeletons";
import { StateMessage } from "@/components/ui/StateMessage";
import { Pagination } from "@/components/ui/Pagination";
import { Select } from "@/components/ui/Select";
import { getAdminMessages, updateMessageStatus } from "@/services/contactService";
import type { ContactMessage } from "@/types/order";
import { useAdminStatus } from "@/lib/auth/admin";

const PAGE_SIZE = 7;

function getMessageStatusStyle(status: string) {
  const map: Record<string, string> = {
    new: "bg-rose-100 text-rose-800 border-rose-300",
    read: "bg-sky-100 text-sky-800 border-sky-300",
    resolved: "bg-emerald-100 text-emerald-800 border-emerald-300",
  };
  return map[status] || "bg-slate-100 text-slate-700 border-slate-200";
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const { isAdmin } = useAdminStatus();
  function load() {
    setPage(1);
    setLoading(true);
    setError("");
    getAdminMessages()
      .then(setMessages)
      .catch((err) => {
        setMessages([]);
        setError(err instanceof Error ? err.message : "Messages could not load.");
      })
      .finally(() => setLoading(false));
  }
  useEffect(() => {
    if (!isAdmin) return;
    window.queueMicrotask(load);
  }, [isAdmin]);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black">Messages</h1>
        <button onClick={load}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >↻ Refresh</button>
      </div>
      {loading ? <div className="mt-5"><ListSkeleton rows={5} /></div> : null}
      {error ? <div className="mt-5"><StateMessage title="Messages could not load" message={error} /></div> : null}
      {!loading && !error && !messages.length ? <div className="mt-5"><StateMessage title="No messages found" message="Customer contact messages will appear here." /></div> : null}
      {!loading && !error && messages.length > 0 ? <div className="mt-5 grid gap-4">
        {messages.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((message) => (
          <div key={message.id}
            className={`rounded-xl border bg-white p-4 shadow-sm ${
              message.status === "new" ? "border-rose-200" :
              message.status === "resolved" ? "border-emerald-200" :
              "border-slate-200"
            }`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-black text-slate-950">{message.name}</h2>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${getMessageStatusStyle(message.status)}`}>
                    {message.status}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  {message.phone ? <a href={`tel:${message.phone}`} className="font-semibold text-teal-700 hover:underline">{message.phone}</a> : null}
                  {message.email ? <a href={`mailto:${message.email}`} className="hover:underline">{message.email}</a> : null}
                </div>
                <p className="mt-2 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700">{message.message}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {message.phone ? (
                    <a href={`tel:${message.phone}`}
                      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-200 px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >📞 Call</a>
                  ) : null}
                  {message.phone ? (
                    <a href={`https://wa.me/977${message.phone}`} target="_blank" rel="noreferrer"
                      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-3 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100"
                    >💬 WhatsApp</a>
                  ) : null}
                  {message.email ? (
                    <a href={`mailto:${message.email}`}
                      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-200 px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >✉ Reply</a>
                  ) : null}
                </div>
              </div>
              <Select
                value={message.status}
                onValueChange={(v) => updateMessageStatus(message.id, v).then(load)}
                items={["new", "read", "resolved"].map((s) => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s }))}
                className="w-full sm:w-32"
              />
            </div>
          </div>
        ))}
      </div> : null}
      {!loading && !error && messages.length > 0 ? <Pagination currentPage={page} totalPages={Math.ceil(messages.length / PAGE_SIZE)} onPageChange={setPage} /> : null}
    </AdminLayout>
  );
}
