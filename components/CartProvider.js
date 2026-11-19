'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const Ctx = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cart');
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem('cart', JSON.stringify(items)); } catch {}
  }, [items, ready]);

  const add = (id, qty = 1) => setItems((c) => ({ ...c, [id]: (c[id] || 0) + qty }));
  const setQty = (id, qty) =>
    setItems((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id]; else next[id] = qty;
      return next;
    });
  const clear = () => setItems({});
  const count = Object.values(items).reduce((a, b) => a + b, 0);

  return <Ctx.Provider value={{ items, add, setQty, clear, count, ready }}>{children}</Ctx.Provider>;
}

export const useCart = () => useContext(Ctx);
