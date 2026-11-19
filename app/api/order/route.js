import { products } from '../../../lib/products';

// এখন অর্ডার শুধু সার্ভার লগে যায়। ডাটাবেস (Supabase/Neon) যোগ করলে এখানেই সেভ করবেন।
export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return Response.json({ error: 'bad request' }, { status: 400 }); }

  const { name, phone, address, items } = body || {};
  if (!name || !phone || !address || !Array.isArray(items) || items.length === 0) {
    return Response.json({ error: 'missing fields' }, { status: 400 });
  }

  // দাম সবসময় সার্ভারে হিসাব হয়, ব্রাউজারের পাঠানো দাম বিশ্বাস করা হয় না।
  let total = 0;
  const lines = [];
  for (const it of items) {
    const p = products.find((x) => x.id === it.id);
    const qty = Number(it.qty);
    if (!p || !Number.isInteger(qty) || qty < 1 || qty > 50) {
      return Response.json({ error: 'invalid item' }, { status: 400 });
    }
    total += p.price * qty;
    lines.push({ id: p.id, qty });
  }
  const shipping = total >= 1000 ? 0 : 60;
  const orderId = 'CG-' + Date.now().toString(36).toUpperCase();

  console.log('NEW ORDER', { orderId, name, phone, address, lines, total: total + shipping });
  return Response.json({ orderId });
}
