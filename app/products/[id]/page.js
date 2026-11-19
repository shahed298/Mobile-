import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products, getProduct, taka } from '../../../lib/products';
import Swatch from '../../../components/Swatch';
import AddButton from '../../../components/AddButton';

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default function ProductPage({ params }) {
  const p = getProduct(params.id);
  if (!p) notFound();
  return (
    <section className="wrap detail">
      <Swatch icon={p.icon} tint={p.tint} big />
      <div>
        <Link href="/#products" className="muted">← সব পণ্য</Link>
        <h1>{p.name}</h1>
        <p className="muted">{p.weight}</p>
        <p className="price">{taka(p.price)}</p>
        <p>{p.desc}</p>
        <AddButton id={p.id} />
      </div>
    </section>
  );
}
