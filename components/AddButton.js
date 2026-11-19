'use client';
import { useState } from 'react';
import { useCart } from './CartProvider';

export default function AddButton({ id }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);
  return (
    <button
      className="btn"
      onClick={() => {
        add(id);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
    >
      {done ? 'কার্টে যোগ হয়েছে' : 'কার্টে যোগ করুন'}
    </button>
  );
}
