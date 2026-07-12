import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MENU, menuById } from "@/lib/menu";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/order/$table")({
  head: ({ params }) => ({
    meta: [
      { title: `Order — Table ${params.table} · Paramount Cafe` },
      {
        name: "description",
        content: `Order from Table ${params.table} at Paramount Cafe. Scan, tap, enjoy.`,
      },
    ],
  }),
  component: OrderPage,
  errorComponent: ({ error }) => (
    <div className="p-8 text-center text-destructive">{error.message}</div>
  ),
  notFoundComponent: () => (
    <div className="p-8 text-center">Table not found.</div>
  ),
});

function OrderPage() {
  const { table } = Route.useParams();
  const tableNumber = Number(table);
  const [qty, setQty] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const items = useMemo(
    () =>
      Object.entries(qty)
        .filter(([, q]) => q > 0)
        .map(([id, q]) => ({ id, name: menuById[id].name, price: menuById[id].price, qty: q })),
    [qty],
  );

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  const change = (id: string, delta: number) =>
    setQty((prev) => {
      const next = Math.max(0, (prev[id] ?? 0) + delta);
      return { ...prev, [id]: next };
    });

  const placeOrder = async () => {
    if (!items.length || submitting) return;
    setSubmitting(true);
    setError(null);
    const { error: err } = await supabase.from("orders").insert({
      table_number: tableNumber,
      items,
      total,
    });
    setSubmitting(false);
    if (err) {
      setError(err.message);
      return;
    }
    setDone(true);
  };

  if (Number.isNaN(tableNumber) || tableNumber < 1) {
    return (
      <div className="grid min-h-screen place-items-center bg-background p-6 text-center">
        <div>
          <h1 className="font-display text-2xl">Invalid table</h1>
          <p className="mt-2 text-muted-foreground">Please scan a valid table QR code.</p>
          <Link to="/" className="mt-4 inline-block text-primary underline">
            Go home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-40">
      {/* Header */}
      <header className="bg-cafe-gradient px-4 pb-8 pt-6 text-cream">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-cream/80">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-espresso text-gold">
                ☕
              </span>
              <span className="font-display text-base">Paramount Cafe</span>
            </Link>
            <span className="rounded-full border border-gold/50 bg-espresso/60 px-3 py-1 text-xs uppercase tracking-widest text-gold">
              Table {tableNumber}
            </span>
          </div>
          <h1 className="mt-6 font-display text-3xl sm:text-4xl">
            Welcome. <span className="text-gradient-gold">Ready to order?</span>
          </h1>
          <p className="mt-2 text-sm text-cream/70">
            Tap + to add items. Your total updates below in real time.
          </p>
        </div>
      </header>

      {/* Menu */}
      <main className="mx-auto max-w-2xl px-4 pt-6">
        <ul className="space-y-4">
          {MENU.map((item) => {
            const n = qty[item.id] ?? 0;
            return (
              <motion.li
                key={item.id}
                layout
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
              >
                <div className="flex gap-3 p-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="h-24 w-24 shrink-0 rounded-xl object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div className="min-w-0">
                      <h3 className="font-display text-lg leading-tight">
                        {item.emoji} {item.name}
                      </h3>
                      <p className="truncate text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-espresso px-3 py-1 text-sm font-semibold text-gold">
                        {item.price} Birr
                      </span>
                      <QtyControl n={n} onDec={() => change(item.id, -1)} onInc={() => change(item.id, 1)} />
                    </div>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>

        {error && (
          <p className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        )}
      </main>

      {/* Sticky total bar */}
      <AnimatePresence>
        {count > 0 && !done && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="fixed inset-x-0 bottom-0 z-30 border-t border-gold/30 bg-espresso/95 px-4 py-4 text-cream backdrop-blur"
          >
            <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-widest text-cream/60">
                  {count} item{count > 1 ? "s" : ""} · Table {tableNumber}
                </p>
                <p className="font-display text-2xl text-gradient-gold">
                  {total} Birr
                </p>
              </div>
              <button
                onClick={placeOrder}
                disabled={submitting}
                className="shrink-0 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-espresso shadow-gold transition hover:brightness-110 disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Place order"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thank-you overlay */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-espresso/95 px-6 text-cream backdrop-blur"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 220, damping: 20 }}
              className="max-w-sm rounded-3xl border border-gold/30 bg-espresso/80 p-8 text-center shadow-gold"
            >
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold text-3xl text-espresso">
                ✓
              </div>
              <h2 className="mt-5 font-display text-3xl">Thank you!</h2>
              <p className="mt-3 text-cream/80">
                Your order has been received. Our team is preparing it now.
              </p>
              <div className="mt-6 rounded-xl bg-espresso/60 p-4 text-left text-sm">
                <p className="text-cream/60">Table {tableNumber}</p>
                <p className="mt-1 font-semibold text-gold">Total: {total} Birr</p>
              </div>
              <button
                onClick={() => {
                  setDone(false);
                  setQty({});
                }}
                className="mt-6 rounded-full border border-cream/30 px-5 py-2 text-sm text-cream hover:bg-cream/10"
              >
                Order more
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function QtyControl({
  n,
  onDec,
  onInc,
}: {
  n: number;
  onDec: () => void;
  onInc: () => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-background p-1">
      <button
        onClick={onDec}
        disabled={n === 0}
        aria-label="Decrease"
        className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-lg font-semibold text-secondary-foreground transition hover:bg-muted disabled:opacity-40"
      >
        −
      </button>
      <span className="w-6 text-center text-sm font-semibold tabular-nums">{n}</span>
      <button
        onClick={onInc}
        aria-label="Increase"
        className="grid h-8 w-8 place-items-center rounded-full bg-primary text-lg font-semibold text-primary-foreground transition hover:brightness-110"
      >
        +
      </button>
    </div>
  );
}
