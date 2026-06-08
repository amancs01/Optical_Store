"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StateMessage } from "@/components/ui/StateMessage";
import { getAdminMessages, updateMessageStatus } from "@/services/contactService";
import type { ContactMessage } from "@/types/order";
import { useCurrentUser } from "@/lib/auth/admin";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAdmin } = useCurrentUser();
  function load() {
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
    load();
  }, [isAdmin]);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-black">Messages</h1>
      {loading ? <p className="mt-5 text-sm text-slate-600">Loading messages...</p> : null}
      {error ? <div className="mt-5"><StateMessage title="Messages could not load" message={error} /></div> : null}
      {!loading && !error && !messages.length ? <div className="mt-5"><StateMessage title="No messages found" message="Customer contact messages will appear here." /></div> : null}
      <div className="mt-5 grid gap-4">
        {messages.map((message) => (
          <div key={message.id} className="rounded-md border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap justify-between gap-3">
              <div><h2 className="font-black">{message.name}</h2><p className="text-sm text-slate-600">{message.phone} - {message.email}</p><p className="mt-2 text-sm text-slate-700">{message.message}</p></div>
              <select value={message.status} onChange={(e) => updateMessageStatus(message.id, e.target.value).then(load)} className="h-11 rounded-md border border-slate-200 px-3 text-sm"><option value="new">new</option><option value="read">read</option><option value="resolved">resolved</option></select>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
