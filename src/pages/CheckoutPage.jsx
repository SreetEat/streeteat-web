import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import DishIcon from "../components/DishIcon";

export default function CheckoutPage() {
  const { cart, changeQuantity, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState(null);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <p className="font-display text-2xl text-paper-50">Your cart is empty.</p>
        <Link to="/" className="mt-4 inline-block text-marigold-400 underline">
          Browse the market
        </Link>
      </div>
    );
  }

  async function handlePlaceOrder() {
    if (!user) {
      navigate("/auth");
      return;
    }
    setPlacing(true);
    setError(null);
    try {
      // totalAmount is intentionally NOT sent -- the backend computes it
      // server-side from each menuItemId's real price. See OrderService.
      const order = await api.placeOrder({
        vendorId: cart.vendorId,
        items: cart.items.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
      });
      clearCart();
      navigate(`/orders/${order.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-chili-400">your order</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold text-paper-50">
        From {cart.vendorName}
      </h1>

      <ul className="mt-8 divide-y divide-dusk-700 rounded-2xl border border-dusk-700 bg-dusk-900">
        {cart.items.map((item) => (
          <li key={item.menuItemId} className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="flex items-center gap-3">
              <DishIcon name={item.name} size={44} />
              <div>
                <p className="font-medium text-paper-50">{item.name}</p>
                <p className="font-mono text-xs text-dusk-400">₹{item.price.toFixed(2)} each</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-dusk-600 px-2 py-1">
                <button
                  onClick={() => changeQuantity(item.menuItemId, -1)}
                  aria-label={`Remove one ${item.name}`}
                  className="h-6 w-6 rounded-full text-dusk-200 hover:text-chili-400"
                >
                  −
                </button>
                <span className="w-5 text-center font-mono text-sm">{item.quantity}</span>
                <button
                  onClick={() => changeQuantity(item.menuItemId, 1)}
                  aria-label={`Add one more ${item.name}`}
                  className="h-6 w-6 rounded-full text-dusk-200 hover:text-mint-400"
                >
                  +
                </button>
              </div>
              <span className="price-tag">₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between border-t border-dusk-700 pt-6">
        <span className="font-display text-lg text-paper-50">Total</span>
        <span className="price-tag text-base">₹{total.toFixed(2)}</span>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-chili-500/40 bg-chili-500/10 px-3 py-2 text-sm text-chili-400">
          {error}
        </p>
      )}

      <button
        onClick={handlePlaceOrder}
        disabled={placing}
        className="mt-6 w-full rounded-full bg-marigold-500 py-3 font-semibold text-dusk-950 transition hover:bg-marigold-400 disabled:opacity-60"
      >
        {placing ? "Placing order…" : user ? "Place order" : "Log in to place order"}
      </button>
    </div>
  );
}
