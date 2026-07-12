import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { MENU } from "@/lib/menu";
import heroImg from "@/assets/cafe-hero.jpg";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const [tableCount, setTableCount] = useState(6);
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#top" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-espresso text-gold">
              ☕
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              Paramount Cafe
            </span>
          </a>
          <nav className="hidden gap-6 text-sm text-muted-foreground sm:flex">
            <a href="#menu" className="hover:text-foreground">Menu</a>
            <a href="#qr" className="hover:text-foreground">Table QR</a>
            <Link to="/staff" className="hover:text-foreground">Staff</Link>
          </nav>
          <Link
            to="/order/$table"
            params={{ table: "1" }}
            className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-elegant transition hover:brightness-110"
          >
            Try Table 1
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section
        id="top"
        className="relative overflow-hidden bg-cafe-gradient text-cream"
      >
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:py-24 md:grid-cols-2 md:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-espresso/40 px-3 py-1 text-xs uppercase tracking-widest text-gold">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              QR ordering
            </span>
            <h1 className="mt-5 font-display text-4xl leading-tight sm:text-6xl">
              Scan. Sip. <span className="text-gradient-gold">Savour.</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-cream/70">
              Every table has its own QR code. Guests scan, order, and pay —
              your kitchen sees it instantly.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#qr"
                className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-espresso shadow-gold transition hover:brightness-110"
              >
                Get table QR codes
              </a>
              <Link
                to="/staff"
                className="rounded-full border border-cream/30 px-6 py-3 text-sm font-semibold text-cream transition hover:bg-cream/10"
              >
                Open staff dashboard
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative"
          >
            <div className="absolute -inset-6 rounded-3xl bg-gold/20 blur-3xl" />
            <img
              src={heroImg}
              alt="Cozy café interior with warm golden lights"
              width={1024}
              height={1024}
              className="relative aspect-square w-full rounded-3xl object-cover shadow-elegant ring-1 ring-gold/30"
            />
          </motion.div>
        </div>
      </section>

      {/* MENU PREVIEW */}
      <section id="menu" className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              On the menu
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">
              Small menu, <span className="text-gradient-gold">big flavour</span>
            </h2>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MENU.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-elegant"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-between p-5">
                <div>
                  <h3 className="font-display text-lg">
                    {item.emoji} {item.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <span className="rounded-full bg-espresso px-3 py-1 text-sm font-semibold text-gold">
                  {item.price} br
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* QR SECTION */}
      <section id="qr" className="border-y border-border bg-secondary/50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              For the owner
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">
              Print a QR for every table
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              Each code links to a specific table number. Save the images or
              print this page.
            </p>
            <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-border bg-background px-4 py-2 text-sm">
              <label htmlFor="tc" className="text-muted-foreground">Tables:</label>
              <input
                id="tc"
                type="number"
                min={1}
                max={30}
                value={tableCount}
                onChange={(e) =>
                  setTableCount(Math.max(1, Math.min(30, Number(e.target.value) || 1)))
                }
                className="w-16 bg-transparent text-center font-semibold outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: tableCount }).map((_, i) => {
              const n = i + 1;
              const url = `${origin}/order/${n}`;
              return (
                <div
                  key={n}
                  className="flex flex-col items-center rounded-2xl border border-border bg-card p-5 text-center shadow-sm"
                >
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">
                    Table
                  </span>
                  <span className="font-display text-3xl text-primary">{n}</span>
                  <div className="my-3 rounded-lg bg-white p-2">
                    <QRCodeSVG value={url} size={128} bgColor="#ffffff" fgColor="#2a1a10" />
                  </div>
                  <a
                    href={url}
                    className="text-[11px] text-muted-foreground break-all hover:text-foreground"
                  >
                    {url}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Paramount Cafe — table-side ordering made simple.
      </footer>
    </div>
  );
}
