import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

type OrderStatus = "new" | "preparing" | "ready" | "delivered";
type OrderItem = { id: string; name: string; price: number; qty: number };
type Order = {
  id: string;
  table_number: number;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  created_at: string;
};

export const Route = createFileRoute("/staff")({
  head: () => ({
    meta: [
      { title: "Staff Dashboard · Paramount Cafe" },
      { name: "description", content: "Live incoming orders for café staff." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: StaffDashboard,
});

const STATUSES: { key: OrderStatus; label: string; color: string }[] = [
  { key: "new", label: "New", color: "bg-gold text-espresso" },
  { key: "preparing", label: "Preparing", color: "bg-orange-500 text-white" },
  { key: "ready", label: "Ready", color: "bg-emerald-500 text-white" },
  { key: "delivered", label: "Delivered", color: "bg-muted text-muted-foreground" },
];

function StaffDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (mounted && data) setOrders(data as unknown as Order[]);
      setLoading(false);
    })();

    const channel = supabase
      .channel("orders-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          setOrders((prev) => {
            if (payload.eventType === "INSERT") {
              return [payload.new as unknown as Order, ...prev];
            }
            if (payload.eventType === "UPDATE") {
              return prev.map((o) =>
                o.id === (payload.new as { id: string }).id ? (payload.new as unknown as Order) : o,
              );
            }
            if (payload.eventType === "DELETE") {
              return prev.filter((o) => o.id !== (payload.old as { id: string }).id);
            }
            return prev;
          });
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const filtered = useMemo(
    () => (filter === "all" ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter],
  );

  const counts = useMemo(() => {
    const c: Record<OrderStatus | "all", number> = {
      all: orders.length,
      new: 0,
      preparing: 0,
      ready: 0,
      delivered: 0,
    };
    orders.forEach((o) => (c[o.status] += 1));
    return c;
  }, [orders]);

  const setStatus = async (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await supabase.from("orders").update({ status }).eq("id", id);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-cafe-gradient text-cream">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-espresso text-gold">
              ☕
            </span>
            <span>
              <p className="font-display text-lg">Paramount Cafe</p>
              <p className="text-[11px] uppercase tracking-widest text-cream/60">
                Kitchen dashboard
              </p>
            </span>
          </Link>
          <div className="rounded-full border border-gold/40 bg-espresso/50 px-3 py-1 text-xs text-gold">
            {loading ? "Connecting…" : "Live"}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {(["all", ...STATUSES.map((s) => s.key)] as const).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                filter === k
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {k === "all" ? "All" : STATUSES.find((s) => s.key === k)?.label}
              <span className="ml-2 rounded-full bg-background/40 px-2 py-0.5 text-xs">
                {counts[k]}
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            <p className="font-display text-xl">No orders yet</p>
            <p className="mt-2 text-sm">New orders will appear here in real time.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence initial={false}>
              {filtered.map((order) => (
                <OrderCard key={order.id} order={order} onSetStatus={setStatus} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

function OrderCard({
  order,
  onSetStatus,
}: {
  order: Order;
  onSetStatus: (id: string, s: OrderStatus) => void;
}) {
  const status = STATUSES.find((s) => s.key === order.status)!;
  const time = new Date(order.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 240, damping: 24 }}
      className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
    >
      <div className="flex items-start justify-between border-b border-border p-4">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
            Table
          </p>
          <p className="font-display text-3xl leading-none text-primary">
            {order.table_number}
          </p>
        </div>
        <div className="text-right">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}>
            {status.label}
          </span>
          <p className="mt-2 text-xs text-muted-foreground">{time}</p>
        </div>
      </div>

      <ul className="flex-1 space-y-1 p-4 text-sm">
        {order.items.map((it) => (
          <li key={it.id} className="flex justify-between">
            <span className="min-w-0 truncate">
              <span className="mr-2 font-semibold text-primary">{it.qty}×</span>
              {it.name}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {it.price * it.qty} br
            </span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between border-t border-border bg-secondary/50 px-4 py-3">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          Total
        </span>
        <span className="font-display text-lg text-primary">
          {Number(order.total)} Birr
        </span>
      </div>

      <div className="grid grid-cols-3 border-t border-border">
        {(["preparing", "ready", "delivered"] as const).map((s) => (
          <button
            key={s}
            onClick={() => onSetStatus(order.id, s)}
            disabled={order.status === s}
            className={`py-2.5 text-xs font-semibold uppercase tracking-wide transition ${
              order.status === s
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            } ${s !== "delivered" ? "border-r border-border" : ""}`}
          >
            {s}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
