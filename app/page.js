import Link from 'next/link';
import { products, taka } from '../lib/products';
import Swatch from '../components/Swatch';
import AddButton from '../components/AddButton';

export default function Home() {
  return (
    <>
      <section className="hero">
        <div>
          <h1>ফোনের দরকারি সবকিছু, এক জায়গায়।</h1>
          <p>চার্জার, কেবল, ইয়ারবাডস, পাওয়ার ব্যাংক আর কভার। অর্ডার করুন, পণ্য হাতে পেয়ে টাকা দিন।</p>
          <Link href="#products" className="btn">পণ্য দেখুন</Link>
        </div>
        <div className="hero-art" aria-hidden="true">🔌🎧📱🔋</div>
      </section>

      <section id="products" className="wrap">
        <h2>সব পণ্য</h2>
        <div className="grid">
          {products.map((p) => (
            <article key={p.id} className="card">
              <Link href={`/products/${p.id}`} className="cardlink">
                <Swatch icon={p.icon} tint={p.tint} />
                <h3>{p.name}</h3>
                <p className="muted">{p.weight}</p>
              </Link>
              <div className="row">
                <strong>{taka(p.price)}</strong>
                <AddButton id={p.id} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
