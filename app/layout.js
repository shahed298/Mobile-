import './globals.css';
import { Hind_Siliguri, Noto_Serif_Bengali } from 'next/font/google';
import { CartProvider } from '../components/CartProvider';
import Header from '../components/Header';

const sans = Hind_Siliguri({ subsets: ['bengali', 'latin'], weight: ['400', '500', '600'], variable: '--sans', display: 'swap' });
const serif = Noto_Serif_Bengali({ subsets: ['bengali', 'latin'], weight: ['600', '800'], variable: '--serif', display: 'swap' });

export const metadata = {
  title: 'মোবাইল কর্নার — মোবাইল অ্যাক্সেসরিজ',
  description: 'চার্জার, ইয়ারবাডস, পাওয়ার ব্যাংক, কভার — ঘরে বসে অর্ডার করুন।',
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <footer className="footer">© মোবাইল কর্নার। ক্যাশ অন ডেলিভারি, সারা দেশে।</footer>
        </CartProvider>
      </body>
    </html>
  );
}
