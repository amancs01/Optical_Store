"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ListSkeleton } from "@/components/ui/LoadingSkeletons";
import { Pagination } from "@/components/ui/Pagination";
import { Select } from "@/components/ui/Select";
import { StateMessage } from "@/components/ui/StateMessage";
import { ORDER_STATUSES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { formatOrderStatus } from "@/lib/orderStatus";
import { getOrders, updateOrderStatus } from "@/services/orderService";
import type { Order, OrderItem } from "@/types/order";
import { useAdminStatus } from "@/lib/auth/admin";

const PAGE_SIZE = 5;

type AdminOrder = Order & { order_items?: OrderItem[] };
type OrderItemWithImage = OrderItem & {
  image_url?: string | null;
  product_image_url?: string | null;
  thumbnail_url?: string | null;
};

function getStatusStyle(status: string) {
  const map: Record<string, string> = {
    pending: "border-amber-200 bg-amber-50 text-amber-800",
    confirmed: "border-sky-200 bg-sky-50 text-sky-800",
    processing: "border-violet-200 bg-violet-50 text-violet-800",
    shipped: "border-indigo-200 bg-indigo-50 text-indigo-800",
    delivered: "border-emerald-200 bg-emerald-50 text-emerald-800",
    cancelled: "border-rose-200 bg-rose-50 text-rose-800",
  };
  return map[status] || "border-slate-200 bg-slate-50 text-slate-700";
}

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatAddress(order: Order) {
  const addr = order.delivery_address || "";
  const city = order.city || "";
  const showCity = city && !addr.toLowerCase().includes(city.toLowerCase());
  return showCity ? `${addr}, ${city}` : addr;
}

function getOrderItemImage(item: OrderItem): string | null {
  const imageItem = item as OrderItemWithImage;
  return imageItem.image_url || imageItem.product_image_url || imageItem.thumbnail_url || null;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<Record<string, boolean>>({});
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);
  const { isAdmin } = useAdminStatus();

  function load() {
    setLoading(true);
    setError("");
    return getOrders()
      .then(setOrders)
      .catch((err) => {
        setOrders([]);
        setError(err instanceof Error ? err.message : "Orders could not load.");
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!isAdmin) return;
    window.queueMicrotask(load);
  }, [isAdmin]);

  const visible = filter ? orders.filter((order) => order.order_status === filter) : orders;
  const totalPages = Math.ceil(visible.length / PAGE_SIZE);
  const paginated = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function updateStatus(order: AdminOrder, newStatus: string) {
    setUpdating((prev) => ({ ...prev, [order.id]: true }));
    updateOrderStatus(order.id, newStatus)
      .catch(() => null)
      .then(() => load())
      .finally(() => setUpdating((prev) => ({ ...prev, [order.id]: false })));
  }

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-black">Orders</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={filter}
            onValueChange={(v) => { setFilter(v); setPage(1); }}
            placeholder="All statuses"
            items={ORDER_STATUSES.map((s) => ({ label: formatStatus(s), value: s }))}
            className="w-44"
          />
          <button
            onClick={load}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Refresh
          </button>
        </div>
      </div>
      {!loading && !error && orders.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total orders", value: orders.length },
            { label: "Pending", value: orders.filter((order) => order.order_status === "pending").length },
            { label: "Confirmed", value: orders.filter((order) => order.order_status === "confirmed").length },
            { label: "Revenue", value: formatCurrency(orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)) },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-md border border-slate-200 bg-white p-3">
              <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
              <p className="mt-1 text-xl font-black text-slate-950">{value}</p>
            </div>
          ))}
        </div>
      )}
      {loading ? <div className="mt-5"><ListSkeleton rows={5} /></div> : null}
      {error ? <div className="mt-5"><StateMessage title="Orders could not load" message={error} /></div> : null}
      {!loading && !error && !visible.length ? <div className="mt-5"><StateMessage title="No orders found" message="New checkout orders will appear here." /></div> : null}
      <div className="mt-5 grid gap-4">
        {paginated.map((order) => (
          <div key={order.id}>
            <MobileOrderCard
              order={order}
              isExpanded={!!expandedItems[order.id]}
              isUpdating={!!updating[order.id]}
              onToggleItems={() => setExpandedItems((prev) => ({ ...prev, [order.id]: !prev[order.id] }))}
              onUpdateStatus={(newStatus) => updateStatus(order, newStatus)}
            />
            <DesktopOrderCard
              order={order}
              isUpdating={!!updating[order.id]}
              onUpdateStatus={(newStatus) => updateStatus(order, newStatus)}
            />
          </div>
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </AdminLayout>
  );
}

function MobileOrderCard({
  order,
  isExpanded,
  isUpdating,
  onToggleItems,
  onUpdateStatus,
}: {
  order: AdminOrder;
  isExpanded: boolean;
  isUpdating: boolean;
  onToggleItems: () => void;
  onUpdateStatus: (newStatus: string) => void;
}) {
  const items = order.order_items || [];
  const visibleItems = isExpanded ? items : items.slice(0, 2);
  const hasMoreItems = items.length > 2;

  return (
    <article className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:hidden">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="break-words text-lg font-black leading-tight text-slate-950">{order.order_number}</h2>
          <p className="mt-1 text-xs font-semibold uppercase text-slate-400">
            {new Date(order.created_at).toLocaleString("en-NP", { dateStyle: "medium", timeStyle: "short" })}
          </p>
        </div>
        <StatusBadge status={order.order_status} />
      </header>

      <section className="rounded-xl bg-slate-50 p-3">
        <p className="font-bold text-slate-950">{order.customer_name}</p>
        <div className="mt-1 grid gap-0.5 text-sm text-slate-600">
          <a href={`tel:${order.customer_phone}`} className="font-semibold text-teal-700">{order.customer_phone}</a>
          {order.customer_email ? <a href={`mailto:${order.customer_email}`} className="break-words">{order.customer_email}</a> : null}
          <p className="break-words">{formatAddress(order)}</p>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-2">
        <a
          href={`tel:${order.customer_phone}`}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 transition active:scale-95"
        >
          Call
        </a>
        <a
          href={`https://wa.me/977${order.customer_phone}?text=${encodeURIComponent(`Hello ${order.customer_name}, your Titan Optical order ${order.order_number} is being processed.`)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-sm font-bold text-emerald-800 transition active:scale-95"
        >
          WhatsApp
        </a>
      </div>

      <section className="grid gap-3 rounded-xl border border-slate-200 p-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase text-slate-400">Total</p>
            <p className="text-2xl font-black text-slate-950">{formatCurrency(order.total_amount)}</p>
          </div>
          <div className="text-right text-xs font-semibold text-slate-500">
            <p>{order.payment_method}</p>
            <p>{formatOrderStatus(order.payment_status)}</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-3">
          <span className="text-xs font-bold uppercase text-slate-400">Current status</span>
          <StatusBadge status={order.order_status} />
        </div>
      </section>

      <section className="grid gap-2">
        <label className="grid gap-2 text-xs font-bold uppercase text-slate-500">
          Update status
          <Select
            ariaLabel={`Update status for ${order.order_number}`}
            value={order.order_status}
            disabled={isUpdating}
            onValueChange={onUpdateStatus}
            items={ORDER_STATUSES.map((s) => ({ label: formatStatus(s), value: s }))}
            className={`h-11 w-full rounded-xl text-base normal-case ${isUpdating ? "opacity-60" : ""}`}
          />
        </label>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-3 py-2">
          <h3 className="text-sm font-black text-slate-800">Items</h3>
          <span className="text-xs font-bold text-slate-400">{items.length}</span>
        </div>
        {items.length ? (
          <div className="divide-y divide-slate-200">
            {visibleItems.map((item) => <MobileOrderItem key={item.id} item={item} />)}
          </div>
        ) : (
          <p className="p-3 text-sm text-slate-600">No order items are attached to this order.</p>
        )}
        {hasMoreItems ? (
          <button
            type="button"
            onClick={onToggleItems}
            className="w-full border-t border-slate-200 bg-white px-3 py-2 text-sm font-bold text-teal-700"
          >
            {isExpanded ? "Hide items" : `View all ${items.length} items`}
          </button>
        ) : null}
      </section>
    </article>
  );
}

function DesktopOrderCard({
  order,
  isUpdating,
  onUpdateStatus,
}: {
  order: AdminOrder;
  isUpdating: boolean;
  onUpdateStatus: (newStatus: string) => void;
}) {
  return (
    <div className="hidden rounded-md border border-slate-200 bg-white p-4 sm:block">
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <h2 className="font-black">{order.order_number}</h2>
          <p className="text-sm text-slate-600">{order.customer_name} - {order.customer_phone}</p>
          {order.customer_email ? <p className="text-sm text-slate-600">{order.customer_email}</p> : null}
          <p className="text-sm text-slate-600">{formatAddress(order)}</p>
          <p className="mt-1 text-xs font-semibold uppercase text-slate-500">
            {new Date(order.created_at).toLocaleString("en-NP", { dateStyle: "medium", timeStyle: "short" })}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <a
              href={`tel:${order.customer_phone}`}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95"
            >
              Call
            </a>
            <a
              href={`https://wa.me/977${order.customer_phone}?text=${encodeURIComponent(`Hello ${order.customer_name}, your Titan Optical order ${order.order_number} is being processed.`)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-3 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 active:scale-95"
            >
              WhatsApp
            </a>
          </div>
        </div>
        <div className="w-full space-y-2 sm:w-auto sm:text-right">
          <p className="font-black">{formatCurrency(order.total_amount)}</p>
          <p className="text-xs font-semibold text-slate-500">{order.payment_method} - {formatOrderStatus(order.payment_status)}</p>
          <Select
            ariaLabel={`Update status for ${order.order_number}`}
            value={order.order_status}
            disabled={isUpdating}
            onValueChange={onUpdateStatus}
            items={ORDER_STATUSES.map((s) => ({ label: formatStatus(s), value: s }))}
            className={`w-full sm:w-auto ${isUpdating ? "opacity-60" : ""}`}
          />
        </div>
      </div>
      <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        <div className="hidden grid-cols-[1fr_auto_auto_auto] gap-10 border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold uppercase text-slate-500 sm:grid">
          <span>Item</span>
          <span>Qty</span>
          <span>Unit</span>
          <span>Subtotal</span>
        </div>
        {(order.order_items || []).length ? (
          <div className="divide-y divide-slate-200">
            {(order.order_items || []).map((item) => (
              <div key={item.id} className="grid gap-1 px-3 py-2 text-sm sm:grid-cols-[1fr_auto_auto_auto] sm:gap-3">
                <span className="font-semibold text-slate-800">{item.product_name}</span>
                <span className="text-slate-600 sm:text-slate-950">Qty {item.quantity}</span>
                <span className="text-slate-600 sm:text-slate-950">Unit {formatCurrency(item.unit_price)}</span>
                <span className="font-bold">Subtotal {formatCurrency(item.total_price)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="p-3 text-sm text-slate-600">No order items are attached to this order.</p>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${getStatusStyle(status)}`}>
      {status}
    </span>
  );
}

function MobileOrderItem({ item }: { item: OrderItem }) {
  const imageUrl = getOrderItemImage(item);

  return (
    <div className="flex gap-3 p-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white text-[10px] font-bold uppercase text-slate-400">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          "No img"
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="break-words text-sm font-bold text-slate-900">{item.product_name}</p>
        {item.selected_color ? <p className="mt-0.5 text-xs text-slate-500">Color: {item.selected_color}</p> : null}
        <p className="mt-1 text-xs font-semibold text-slate-600">
          Qty {item.quantity} x {formatCurrency(item.unit_price)}
        </p>
        <p className="mt-0.5 text-sm font-black text-slate-950">Subtotal {formatCurrency(item.total_price)}</p>
      </div>
    </div>
  );
}
