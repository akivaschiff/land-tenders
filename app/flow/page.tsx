'use client';

import Link from 'next/link';

const steps = [
  {
    num: '01',
    title: 'קצת פרטים עליכם',
    sub: 'שירות מילואים, יחידה קרבית, נכסים ברשותך',
  },
  {
    num: '02',
    title: 'נמצא את המכרז המתאים',
    sub: 'מאגר מלא של קרקעות ממשלתיות בכל הארץ',
  },
  {
    num: '03',
    title: 'תדעו בדיוק כמה זה עולה לכם',
    sub: 'מחיר אמיתי, אחרי כל ההנחות שמגיעות לך',
  },
];

export default function FlowLandingPage() {
  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#fff8f0] via-white to-[#fff8f0] overflow-hidden w-full"
      dir="rtl"
      style={{ fontFamily: "'Heebo', 'Arial Hebrew', sans-serif" }}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-l from-terracotta-400 via-amber-400 to-terracotta-600" />

      <div className="px-5 pt-10 pb-16 w-full">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-terracotta-50 border border-terracotta-200 text-terracotta-700 text-xs font-bold px-3 py-1.5 rounded-full mb-8">
          <span className="w-2 h-2 bg-terracotta-500 rounded-full animate-pulse flex-shrink-0" />
          זכות שמגיעה לך בחוק
        </div>

        {/* Hero — lines broken intentionally short so each fits on mobile */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 leading-tight mb-3" style={{ wordBreak: 'keep-all', overflowWrap: 'anywhere' }}>
            <span className="block">יש לך הנחה</span>
            <span className="block text-terracotta-500">של מאות אלפי ₪</span>
            <span className="block text-2xl font-bold text-gray-600 mt-1">על קרקע מהמדינה.</span>
          </h1>
          <p className="text-gray-500 text-base leading-relaxed">
            משרתי מילואים זכאים להנחה אדירה על מכרזי קרקע ממשלתיים — וכמעט אף אחד לא מנצל אותה.
          </p>
        </div>

        {/* Steps */}
        <div className="mb-10 space-y-3">
          {steps.map((s) => (
            <div
              key={s.num}
              className="flex gap-4 items-start bg-white rounded-2xl px-4 py-4 shadow-sm border border-gray-100"
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-terracotta-50 flex items-center justify-center">
                <span className="text-terracotta-600 font-black text-sm">{s.num}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-gray-900 text-sm leading-snug">{s.title}</p>
                <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link href="/flow/signup" className="block w-full">
          <button className="w-full bg-terracotta-500 active:scale-[0.98] text-white font-extrabold py-4 rounded-2xl shadow-lg text-lg transition-all duration-150 mb-3">
            גלו כמה מגיע לי ←
          </button>
        </Link>

        {/* Share nudge */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-400 mb-1.5">לא בשירות מילואים?</p>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              const url = `${window.location.origin}/flow`;
              window.open(`https://wa.me/?text=${encodeURIComponent(`גילית שמשרתי מילואים זכאים להנחה של מאות אלפי ₪ על קרקע ממשלתית 🏡\nבדקו אם מגיע לכם: ${url}`)}`, '_blank', 'noopener,noreferrer');
            }}
            className="text-terracotta-500 font-bold text-sm underline underline-offset-2"
          >
            שתפו חבר שבשירות 🤝
          </a>
        </div>

        {/* Trust footnote */}
        <p className="text-[11px] text-gray-300 text-center mt-10">
          מבוסס על נתוני מכרזי רמ״י הרשמיים · ניתוח אישי חינם
        </p>

      </div>
    </div>
  );
}
