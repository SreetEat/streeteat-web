import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/client";
import { useCart } from "../context/CartContext";
import DishIcon from "../components/DishIcon";

export default function VendorPage() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [menu, setMenu] = useState(null);
  const [error, setError] = useState(null);
  const [justAdded, setJustAdded] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    Promise.all([api.getVendor(id), api.getVendorMenu(id)])
      .then(([v, m]) => {
        setVendor(v);
        setMenu(m);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  function handleAdd(item) {
    addItem(vendor, item);
    setJustAdded(item.id);
    setTimeout(() => setJustAdded(null), 900);
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="text-chili-400">Couldn't load this stall: {error}</p>
        <Link to="/" className="mt-4 inline-block text-marigold-400 underline">
          Back to the market
        </Link>
      </div>
    );
  }

  if (!vendor || !menu) {
    return <div className="mx-auto max-w-3xl px-6 py-16 text-dusk-200">Loading the stall…</div>;
  }

  return (
    <div>
      <div className="market-glow border-b border-dusk-800">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <Link to="/" className="font-mono text-xs text-dusk-400 hover:text-marigold-400">
            ← back to the market
          </Link>

          <div className="enter-up mt-6 flex items-center gap-5">
            <DishIcon name={vendor.name} size={72} />
            <div>
              <div className="flex items-center gap-2">
                <span className="glow-dot" aria-hidden="true" />
                <span className="font-mono text-xs uppercase tracking-wide text-mint-300">Open now</span>
              </div>
              <h1 className="mt-1 font-display text-4xl font-extrabold text-paper-50">{vendor.name}</h1>
              <p className="mt-1 text-sm text-dusk-200">{vendor.address}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-12">
        <h2 className="mb-5 font-display text-xl font-bold text-marigold-400">Menu</h2>

        {menu.length === 0 ? (
          <p className="text-dusk-200">No items on the menu yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {menu.map((item, i) => (
              <div
                key={item.id}
                className="stall-card enter-up flex items-center gap-4 p-4"
                style={{ animationDelay: `${Math.min(i, 8) * 0.05}s` }}
              >
                <DishIcon name={item.name} size={56} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-paper-50">{item.name}</p>
                  {!item.available ? (
                    <p className="mt-0.5 font-mono text-xs uppercase tracking-wide text-chili-400">
                      Sold out for today
                    </p>
                  ) : (
                    <span className="price-tag mt-1.5">₹{Number(item.price).toFixed(2)}</span>
                  )}
                </div>
                <button
                  disabled={!item.available}
                  onClick={() => handleAdd(item)}
                  className="shrink-0 rounded-full bg-marigold-500 px-4 py-1.5 text-sm font-semibold text-dusk-950 transition hover:bg-marigold-400 disabled:cursor-not-allowed disabled:bg-dusk-700 disabled:text-dusk-400"
                >
                  {justAdded === item.id ? "Added ✓" : "Add"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
