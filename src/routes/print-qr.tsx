import { createFileRoute, Link } from "@tanstack/react-router";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/print-qr")({
  head: () => ({
    meta: [
      { title: "Print Table QR Codes — Paramount Cafe" },
      {
        name: "description",
        content: "Print-ready QR codes for every table at Paramount Cafe.",
      },
    ],
  }),
  component: PrintQrPage,
});

const MAX_TABLES = 50;

function PrintQrPage() {
  const [origin, setOrigin] = useState("");
  const [publicUrl, setPublicUrl] = useState("");
  const search = Route.useSearch();
  const tableCount = Math.max(1, Math.min(MAX_TABLES, Number(search.tables) || 6));

  useEffect(() => {
    setPublicUrl(localStorage.getItem("paramount_public_url") ?? "");
    setOrigin(window.location.origin);
  }, []);

  const baseUrl = (publicUrl.trim().replace(/\/+$/, "")) || origin;

  return (
    <div className="min-h-screen bg-white text-espresso">
      {/* Screen-only header */}
      <div className="screen-only sticky top-0 z-40 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            to="/"
            className="font-display text-lg font-semibold tracking-tight"
          >
            ☕ Paramount Cafe
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {tableCount} tables
            </span>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Print this page
            </button>
          </div>
        </div>
      </div>

      {/* Print header */}
      <div className="print-header mx-auto max-w-6xl px-6 py-8 text-center">
        <h1 className="font-display text-3xl font-semibold">Paramount Cafe</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Scan the QR code at your table to order.
        </p>
      </div>

      {/* QR grid */}
      <div className="mx-auto max-w-6xl px-6 pb-12">
        <div className="qr-grid grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: tableCount }).map((_, i) => {
            const n = i + 1;
            const url = `${origin}/order/${n}`;
            return (
              <div
                key={n}
                className="qr-card flex flex-col items-center rounded-xl border border-gray-200 bg-white p-4 text-center"
              >
                <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Table
                </span>
                <span className="font-display text-4xl font-semibold text-espresso">
                  {n}
                </span>
                <div className="my-2 rounded bg-white p-1">
                  {origin && (
                    <QRCodeSVG
                      value={url}
                      size={160}
                      bgColor="#ffffff"
                      fgColor="#2a1a10"
                      level="M"
                    />
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {origin ? url : `Table ${n}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Print footer */}
      <div className="print-footer mt-auto border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Paramount Cafe — table-side ordering
      </div>
    </div>
  );
}
