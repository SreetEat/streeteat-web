import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const { itemCount, total } = useCart();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 border-b border-dusk-700 bg-dusk-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-extrabold tracking-tight text-paper-50">
            Street<span className="text-marigold-500">Eat</span>
          </span>
          <span className="hidden font-mono text-xs text-dusk-400 sm:inline">market, mapped</span>
        </Link>

        <div className="flex items-center gap-4">
          {itemCount > 0 && (
            <button
              onClick={() => navigate("/checkout")}
              className="flex items-center gap-2 rounded-full border border-marigold-500/40 bg-marigold-500/10 px-4 py-1.5 text-sm font-medium text-marigold-300 transition hover:bg-marigold-500/20"
            >
              <span>{itemCount} item{itemCount > 1 ? "s" : ""}</span>
              <span className="price-tag !py-0.5 !px-2 !pl-3 text-xs">₹{total.toFixed(2)}</span>
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-dusk-200 sm:inline">Hi, {user.name.split(" ")[0]}</span>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="rounded-full border border-dusk-600 px-4 py-1.5 text-sm text-dusk-200 transition hover:border-chili-500 hover:text-chili-400"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="rounded-full bg-marigold-500 px-4 py-1.5 text-sm font-semibold text-dusk-950 transition hover:bg-marigold-400"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
