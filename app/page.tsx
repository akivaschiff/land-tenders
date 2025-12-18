'use client';

import { useState } from 'react';
import Link from 'next/link';
import UserInfoModal from '@/components/UserInfoModal';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="relative min-h-screen flex flex-col justify-center overflow-hidden px-4 py-12">
      {/* Decorative organic shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 right-10 w-64 h-64 bg-terracotta-200 organic-blob opacity-30 animate-float"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="absolute bottom-32 left-20 w-96 h-96 bg-amber-200 organic-blob opacity-20 animate-float"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute top-40 left-10 w-48 h-48 bg-sage-200 organic-blob opacity-25 animate-float"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute bottom-20 right-32 w-72 h-72 bg-sky-200 organic-blob opacity-20 animate-float"
          style={{ animationDelay: '3s' }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="text-center mb-16">
          {/* Hero badge */}
          <div className="inline-block mb-8 animate-fade-in">
            <span className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-terracotta-100">
              <span className="w-2 h-2 bg-terracotta-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-terracotta-700">לראשונה - מידע נגיש על קרקעות</span>
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight animate-slide-up">
            <span className="block text-gray-900">קנו קרקע בהנחה</span>
            <span className="block text-gradient mt-2">עד 50%</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-700 mb-6 max-w-3xl mx-auto leading-relaxed animate-slide-up animation-delay-200">
            <span className="font-semibold text-terracotta-600">גם אם מעולם לא קניתם קרקע</span> - גלו בדיוק כמה עולה לקנות מגרש בכל מקום בארץ
          </p>

          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto animate-slide-up animation-delay-300">
            קבלו הנחות משמעותיות על סמך פרטים אישיים - שירות צבאי, מצב משפחתי ועוד. המידע שהיה נסתר במסמכים ממשלתיים, עכשיו זמין לכולם.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up animation-delay-400">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary text-lg group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                גלו את ההנחה שלכם
                <svg
                  className="w-5 h-5 transition-transform group-hover:-translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 17l-5-5m0 0l5-5m-5 5h12"
                  />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-terracotta-600 to-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-right" />
            </button>

            <Link href="/tenders">
              <button className="btn-secondary text-lg">
                עיון במכרזים ללא התחברות
              </button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 pt-12 border-t border-gray-200/50 animate-fade-in animation-delay-600">
            <p className="text-sm text-gray-500 mb-6">נגיש לאלפי ישראלים שקונים קרקע בפעם הראשונה</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8 md:gap-12">
              <div className="text-center" dir="ltr">
                <div className="text-3xl font-bold text-terracotta-600 mb-1">+20</div>
                <div className="text-sm text-gray-600" dir="rtl">מכרזים פעילים</div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-gray-200"></div>
              <div className="text-center" dir="ltr">
                <div className="text-3xl font-bold text-amber-600 mb-1">+17</div>
                <div className="text-sm text-gray-600" dir="rtl">ערים ברחבי הארץ</div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-gray-200"></div>
              <div className="text-center" dir="ltr">
                <div className="text-3xl font-bold text-sage-600 mb-1">50%</div>
                <div className="text-sm text-gray-600" dir="rtl">הנחה אפשרית</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features grid */}
        <div className="mt-12 animate-fade-in animation-delay-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-container p-6 text-right">
              <div className="w-12 h-12 bg-gradient-warm rounded-xl mb-4 flex items-center justify-center mr-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">תמחור מותאם אישית</h3>
              <p className="text-sm text-gray-600">הנחות על פי שירות צבאי, מצב משפחתי ופרמטרים נוספים</p>
            </div>

            <div className="card-container p-6 text-right">
              <div className="w-12 h-12 bg-gradient-earth rounded-xl mb-4 flex items-center justify-center mr-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">מפה אינטראקטיבית</h3>
              <p className="text-sm text-gray-600">ראו בדיוק איפה נמצאים המגרשים וכמה הם עולים</p>
            </div>

            <div className="card-container p-6 text-right">
              <div className="w-12 h-12 bg-gradient-warm rounded-xl mb-4 flex items-center justify-center mr-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">מידע רשמי ומאומת</h3>
              <p className="text-sm text-gray-600">נתונים ממשלתיים מעודכנים ישירות ממכרזי רמ״י</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Info Modal */}
      <UserInfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}
