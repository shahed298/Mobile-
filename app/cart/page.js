'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '../../components/CartProvider';
import { products, taka } from '../../lib/products';

export default function CartPage() {
  const { items, setQty, clear, ready } = useCart();
  const [status, setStatus] = useState(null); // null | 'sending' | 'error' | { id }

  const lines = products.filter((p) => items[p.id]).map((p) => ({ ...p, qty: items[p.id] }));
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const shipping = subtotal === 0 || subtotal >= 1000 ? 0 : 60;

  async function submit(e) {
    e.preventDefault();
    const f = new FormData(e.target);
    setStatus('sending');
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.get('name'),
          phone: f.get('phone'),
          address: f.get('address'),
          items: lines.map((l) => ({ id: l.id, qty: l.qty })),
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      clear();
      setStatus({ id: data.orderId });
    } catch {
      setStatus('error');
    }
  }

  if (status && status.id) {
    return (
      <section className="wrap narrow">
        <h1>অর্ডার হয়ে গেছে</h1>
        <p>অর্ডার নম্বর <strong>{status.id}</strong>। আমরা ফোনে কনফার্ম করব।</p>
        <Link href="/" className="btn">আরও পণ্য দেখুন</Link>
      </section>
    );
  }

  if (!ready) return <section className="wrap narrow" />;

  if (lines.length === 0) {
    return (
      <section className="wrap narrow">
        <h1>কার্ট খালি</h1>
        <p>পছন্দের পণ্য বেছে কার্টে যোগ করুন।</p>
        <Link href="/#products" className="btn">পণ্য দেখুন</Link>
      </section>
    );
  }

  return (
    <section className="wrap narrow">
      <h1>কার্ট</h1>
      <ul className="lines">
        {lines.map((l) => (
          <li key={l.id}>
            <div>
              <strong>{l.name}</strong>
              <div className="muted">{taka(l.price)} × {l.qty.toLocaleString('bn-BD')}</div>
            </div>
            <div className="qty">
              <button aria-label="কমান" onClick={() => setQty(l.id, l.qty - 1)}>−</button>
              <span>{l.qty.toLocaleString('bn-BD')}</span>
              <button aria-label="বাড়ান" onClick={() => setQty(l.id, l.qty + 1)}>+</button>
            </div>
          </li>
        ))}
      </ul>

      <dl className="totals">
        <div><dt>পণ্যের দাম</dt><dd>{taka(subtotal)}</dd></div>
        <div><dt>ডেলিভারি</dt><dd>{shipping === 0 ? 'ফ্রি' : taka(shipping)}</dd></div>
        <div className="grand"><dt>মোট</dt><dd>{taka(subtotal + shipping)}</dd></div>
      </dl>
      <p className="muted">৳১,০০০ বা তার বেশির অর্ডারে ডেলিভারি ফ্রি।</p>

      <form onSubmit={submit} className="form">
        <label>নাম<input name="name" required autoComplete="name" /></label>
        <label>মোবাইল নম্বর<input name="phone" required inputMode="tel" autoComplete="tel" /></label>
        <label>ঠিকানা (কভার/গ্লাসের জন্য ফোনের মডেলও লিখুন)<textarea name="address" required rows={3} autoComplete="street-address" /></label>
        <button className="btn" disabled={status === 'sending'}>
          {status === 'sending' ? 'পাঠানো হচ্ছে…' : 'অর্ডার করুন (ক্যাশ অন ডেলিভারি)'}
        </button>
        {status === 'error' && <p className="error">অর্ডার পাঠানো যায়নি। ইন্টারনেট দেখে আবার চেষ্টা করুন।</p>}
      </form>
    </section>
  );
}
