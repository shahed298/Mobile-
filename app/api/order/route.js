import { products } from '../../../lib/products';

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
    lines.push(`- ${p.name} x ${qty} = ৳${p.price * qty}`);
  }
  const shipping = total >= 1000 ? 0 : 60;
  const orderId = 'CG-' + Date.now().toString(36).toUpperCase();

  const text = [
    `নতুন অর্ডার ${orderId}`,
    '',
    ...lines,
    '',
    `ডেলিভারি: ৳${shipping}`,
    `মোট (ক্যাশ অন ডেলিভারি): ৳${total + shipping}`,
    '',
    `নাম: ${String(name).slice(0, 100)}`,
    `ফোন: ${String(phone).slice(0, 30)}`,
    `ঠিকানা: ${String(address).slice(0, 400)}`,
  ].join('\n');

  console.log('NEW ORDER', text);

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error('Telegram settings missing');
    return Response.json({ error: 'not configured' }, { status: 500 });
  }

  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!r.ok) throw new Error(await r.text());
  } catch (e) {
    console.error('Telegram failed', e);
    return Response.json({ error: 'notify failed' }, { status: 502 });
  }

  return Response.json({ orderId });
}
