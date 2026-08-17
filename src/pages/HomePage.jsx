import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import DishIcon from "../components/DishIcon";

export default function HomePage() {
  const [vendors, setVendors] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .listVendors()
      .then(setVendors)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <section className="market-glow relative overflow-hidden border-b border-dusk-800">
        <FloatingMotif className="left-[6%] top-16 text-marigold-500/40" size={70} style={{ "--rot": "-8deg" }} delay="0s" shape="marigold" />
        <FloatingMotif className="right-[10%] top-8 text-chili-500/35" size={54} style={{ "--rot": "10deg" }} delay="0.6s" shape="chili" />
        <FloatingMotif className="right-[22%] bottom-10 text-mint-500/30" size={44} style={{ "--rot": "-4deg" }} delay="1.1s" shape="leaf" />

        <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <p className="enter-up font-mono text-xs uppercase tracking-[0.2em] text-chili-400" style={{ animationDelay: "0.05s" }}>
            the evening market is open
          </p>
          <h1
            className="enter-up mt-4 max-w-3xl font-display text-5xl font-extrabold leading-[1.05] text-paper-50 sm:text-7xl"
            style={{ animationDelay: "0.15s" }}
          >
            Real street food,
            <br />
            <span className="text-marigold-500">found in minutes.</span>
          </h1>
          <p className="enter-up mt-6 max-w-xl text-lg text-dusk-200" style={{ animationDelay: "0.28s" }}>
            Every stall below is a real vendor, not a chain kitchen. Order straight
            from the people who've been perfecting one dish for years.
          </p>

          <div className="enter-up mt-9 flex flex-wrap items-center gap-6" style={{ animationDelay: "0.4s" }}>
            <a
              href="#market"
              className="rounded-full bg-marigold-500 px-7 py-3 font-semibold text-dusk-950 shadow-[0_8px_24px_-6px_rgba(255,177,0,0.5)] transition hover:scale-[1.03] hover:bg-marigold-400"
            >
              Browse the market ↓
            </a>
            <div className="flex items-center gap-2 text-sm text-dusk-200">
              <span className="glow-dot" aria-hidden="true" />
              <span>{vendors ? vendors.length : "…"} stalls open right now</span>
            </div>
          </div>
        </div>
      </section>

      <section id="market" className="mx-auto max-w-6xl px-6 py-16">
        {error && (
          <div className="rounded-xl border border-chili-500/40 bg-chili-500/10 px-5 py-4 text-chili-400">
            Couldn't reach the market right now: {error}
          </div>
        )}

        {!vendors && !error && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="stall-card h-64 animate-pulse" />
            ))}
          </div>
        )}

        {vendors && vendors.length === 0 && (
          <div className="rounded-xl border border-dusk-700 bg-dusk-900 px-6 py-10 text-center text-dusk-200">
            No stalls are listed yet. Check back soon — new vendors join the market every week.
          </div>
        )}

        {vendors && vendors.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vendors.map((vendor, i) => (
              <VendorStallCard key={vendor.id} vendor={vendor} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function FloatingMotif({ className, size, delay, shape, style }) {
  const shapes = {
    marigold: (
      <>
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <ellipse
              key={i}
              cx={22 + Math.cos(angle) * 9}
              cy={22 + Math.sin(angle) * 9}
              rx="7"
              ry="4"
              transform={`rotate(${(angle * 180) / Math.PI} ${22 + Math.cos(angle) * 9} ${22 + Math.sin(angle) * 9})`}
              fill="currentColor"
            />
          );
        })}
        <circle cx="22" cy="22" r="6" fill="currentColor" />
      </>
    ),
    chili: (
      <path
        d="M8 14c8-4 20-2 26 6 3 4 2 10-3 12-8 3-18-1-23-9-2-4-2-7 0-9z"
        fill="currentColor"
      />
    ),
    leaf: <path d="M6 30C6 14 20 6 34 8c1 14-8 26-24 26-2 0-4-2-4-4z" fill="currentColor" />,
  };

  return (
    <svg
      viewBox="0 0 44 44"
      width={size}
      height={size}
      className={`float-slow pointer-events-none absolute hidden sm:block ${className}`}
      style={{ animationDelay: delay, ...style }}
      aria-hidden="true"
    >
      {shapes[shape]}
    </svg>
  );
}

function VendorStallCard({ vendor, index }) {
  return (
    <Link
      to={`/vendor/${vendor.id}`}
      className="stall-card enter-up group block overflow-hidden p-6"
      style={{ animationDelay: `${Math.min(index, 6) * 0.06}s` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="glow-dot" aria-hidden="true" />
            <span className="font-mono text-xs uppercase tracking-wide text-mint-300">Open now</span>
          </div>
          <h3 className="mt-2 font-display text-2xl font-bold text-paper-50 group-hover:text-marigold-300">
            {vendor.name}
          </h3>
        </div>
        <div className="flex -space-x-3">
          <DishIcon name={vendor.name} size={40} className="ring-2 ring-dusk-800" />
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-dusk-200">
        {vendor.address || "Address not listed yet."}
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-dusk-700 pt-4">
        <span className="text-sm text-dusk-400">{vendor.phone}</span>
        <span className="font-mono text-sm font-medium text-marigold-400 transition group-hover:translate-x-1">
          View menu →
        </span>
      </div>
    </Link>
  );
}
