import { createContext, useContext, useMemo, useState, useCallback } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // { vendorId, vendorName, items: [{ menuItemId, name, price, quantity }] }
  const [cart, setCart] = useState(null);

  const addItem = useCallback((vendor, menuItem) => {
    setCart((prev) => {
      if (prev && prev.vendorId !== vendor.id) {
        const proceed = window.confirm(
          `Your cart has items from ${prev.vendorName}. Starting an order from ${vendor.name} will clear it. Continue?`
        );
        if (!proceed) return prev;
        prev = null;
      }
      const base = prev || { vendorId: vendor.id, vendorName: vendor.name, items: [] };
      const existing = base.items.find((i) => i.menuItemId === menuItem.id);
      const items = existing
        ? base.items.map((i) =>
            i.menuItemId === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...base.items, { menuItemId: menuItem.id, name: menuItem.name, price: menuItem.price, quantity: 1 }];
      return { ...base, items };
    });
  }, []);

  const changeQuantity = useCallback((menuItemId, delta) => {
    setCart((prev) => {
      if (!prev) return prev;
      const items = prev.items
        .map((i) => (i.menuItemId === menuItemId ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0);
      return items.length ? { ...prev, items } : null;
    });
  }, []);

  const clearCart = useCallback(() => setCart(null), []);

  const total = useMemo(
    () => (cart ? cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0) : 0),
    [cart]
  );

  const itemCount = useMemo(
    () => (cart ? cart.items.reduce((sum, i) => sum + i.quantity, 0) : 0),
    [cart]
  );

  return (
    <CartContext.Provider value={{ cart, addItem, changeQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
