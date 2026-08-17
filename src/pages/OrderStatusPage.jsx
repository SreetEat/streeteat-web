import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/client";
import DishIcon from "../components/DishIcon";

const STATUS_LABEL = {
  PENDING: "Waiting for the vendor to accept",
  ACCEPTED: "Vendor is preparing your order",
  PREPARING: "Vendor is preparing your order",
  READY: "Ready — waiting for a delivery partner",
  OUT_FOR_DELIVERY: "On its way to you",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REJECTED: "Vendor couldn't take this order",
};

export default function OrderStatusPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    function poll() {
      api
        .getOrder(id)
        .then((data) => {
          if (!cancelled) setOrder(data);
        })
        .catch((err) => {
          if (!cancelled) setError(err.message);
        });
    }

    poll();
    const interval = setInterval(poll, 8000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto max-w-xl px-6 py-16 text-center">
        <p className="text-chili-400">Couldn't load this order: {error}</p>
        <Link to="/" className="mt-4 inline-block text-marigold-400 underline">
          Back to the market
        </Link>
      </div>
    );
  }

  if (!order) {
    return <div className="mx-auto max-w-xl px-6 py-16 text-dusk-200">Loading your order…</div>;
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-chili-400">order #{order.id}</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-paper-50">
        {STATUS_LABEL[order.status] || order.status}
      </h1>

      <div className="mt-6 flex items-center gap-2">
        <span className="glow-dot" aria-hidden="true" />
        <span className="font-mono text-xs uppercase tracking-wide text-mint-300">
          Updates automatically
        </span>
      </div>

      <ul className="mt-8 divide-y divide-dusk-700 rounded-2xl border border-dusk-700 bg-dusk-900">
        {order.items.map((item) => (
          <li key={item.menuItemId} className="flex items-center justify-between px-5 py-4">
            <span className="flex items-center gap-3 text-paper-50">
              <DishIcon name={item.menuItemName} size={40} />
              {item.quantity} × {item.menuItemName}
            </span>
            <span className="price-tag">₹{Number(item.lineTotal).toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between border-t border-dusk-700 pt-6">
        <span className="font-display text-lg text-paper-50">Total</span>
        <span className="price-tag text-base">₹{Number(order.totalAmount).toFixed(2)}</span>
      </div>

      <Link to="/" className="mt-8 inline-block text-sm text-marigold-400 underline">
        ← back to the market
      </Link>
    </div>
  );
}
