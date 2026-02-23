'use client';

import Link from 'next/link';

export default function FlowLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-terracotta-50" dir="rtl">
      <div className="px-5 pt-14 pb-12 max-w-md mx-auto flex flex-col min-h-screen">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-terracotta-100 text-terracotta-700 text-xs font-bold px-3 py-1.5 rounded-full mb-8 self-start animate-fade-in">
          <span className="w-1.5 h-1.5 bg-terracotta-500 rounded-full animate-pulse" />
          זכות של משרתי מילואים
        </div>

        {/* Hero */}
        <div className="flex-1 animate-slide-up">
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            הנחה של{' '}
            <span className="text-terracotta-600">מאות אלפי</span>
            {' '}שקלים
            <br />
            <span className="text-2xl font-bold text-gray-600">על קניית קרקע מהמדינה</span>
          </h1>

          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            אנשי מילואים זכאים להנחות אדירות במכרזי קרקע ממשלתיים.
            <br />
            <span className="font-semibold text-gray-800">כמעט אף אחד לא מנצל את זה</span> — כי התהליך מסורבל ומפחיד.
            <br /><br />
            אנחנו כאן לשנות את זה.
          </p>

          {/* Steps */}
          <div className="space-y-3 mb-10">
            {[
              { icon: '📋', text: 'ספר/י לנו כמה פרטים בסיסיים' },
              { icon: '🔍', text: 'נמצא את המכרז הכי מתאים לך' },
              { icon: '💰', text: 'גלה/י כמה הנחה מגיעה לך בדיוק' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-amber-100">
                <span className="text-2xl">{icon}</span>
                <span className="text-gray-700 font-medium text-sm">{text}</span>
              </div>
            ))}
          </div>

          {/* Primary CTA */}
          <Link href="/flow/signup">
            <button className="w-full bg-terracotta-500 hover:bg-terracotta-600 active:scale-95 text-white font-bold py-4 rounded-2xl shadow-lg transition-all duration-200 text-lg mb-4">
              לקרקע שמתאימה לי ←
            </button>
          </Link>

          {/* Share nudge */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">לא בשירות מילואים?</p>
            <a
              href={`https://wa.me/?text=${encodeURIComponent('יש לך הנחה של מאות אלפי שקלים על קרקע ממשלתית שאתה לא מנצל 👇\nhttps://mitrani.co.il/flow')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-terracotta-600 font-semibold text-sm underline underline-offset-2 active:opacity-70"
            >
              שתף/י חבר/ה שכן בשירות מילואים 🤝
            </a>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-xs text-gray-400 text-center mt-8">
          מבוסס על נתוני מכרזי רמ״י הרשמיים
        </p>
      </div>
    </div>
  );
}
