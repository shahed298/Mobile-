'use client';
import Link from 'next/link';
import { useCart } from './CartProvider';

export default function Header() {
  const { count, ready } = useCart();
  return (
    <header className="header">
      <Link href="/" className="brand">মোবাইল কর্নার</Link>
      <nav>
        <Link href="/#products">পণ্য</Link>
        <Link href="/cart" className="cartlink">
          কার্ট{ready && count > 0 ? <span className="badge">{count.toLocaleString('bn-BD')}</span> : null}
        </Link>
      </nav>
    </header>
  );
}
