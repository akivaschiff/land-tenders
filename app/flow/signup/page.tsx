'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  isReservist: boolean;
  hasProperty: boolean;
  isCombat: boolean;
  firstName: string;
  lastName: string;
  phone: string;
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all duration-200 ${
        checked
          ? 'bg-terracotta-50 border-terracotta-400'
          : 'bg-white border-gray-200'
      }`}
    >
      {/* Label on the right (RTL) */}
      <span className={`font-medium text-sm text-right ${checked ? 'text-terracotta-800' : 'text-gray-700'}`}>
        {label}
      </span>

      {/* Toggle track — dir="ltr" so the circle always slides left→right */}
      <div
        dir="ltr"
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ml-3 ${
          checked ? 'bg-terracotta-500' : 'bg-gray-300'
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
    </button>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    isReservist: false,
    hasProperty: false,
    isCombat: false,
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    localStorage.setItem('userProfile', JSON.stringify(form));
    setTimeout(() => router.push('/flow/tenders'), 2500);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex flex-col items-center justify-center" dir="rtl">
        <div className="text-6xl mb-5 animate-bounce">🏡</div>
        <h2 className="text-xl font-bold text-terracotta-700 mb-1">מחפשים עסקאות בשבילך...</h2>
        <p className="text-gray-500 text-sm">רגע אחד, בודקים מה מגיע לך</p>
        <div className="mt-6 flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 bg-terracotta-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white" dir="rtl">
      <div className="px-5 pt-8 pb-8 max-w-md mx-auto">

        <button
          onClick={() => router.back()}
          className="text-gray-400 text-sm mb-4 flex items-center gap-1"
        >
          → חזרה
        </button>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-0.5">כמה פרטים קטנים</h1>
        <p className="text-gray-500 text-sm mb-5">נמצא לכם את הדילים הכי רלוונטיים</p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Eligibility */}
          <div>
            <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">זכאות</h2>
            <div className="space-y-2">
              <Toggle
                label="אני בשירות מילואים"
                checked={form.isReservist}
                onChange={v => setForm(f => ({ ...f, isReservist: v }))}
              />
              <Toggle
                label="יש לי כבר נכס ברשותי"
                checked={form.hasProperty}
                onChange={v => setForm(f => ({ ...f, hasProperty: v }))}
              />
              <Toggle
                label="שירתי ביחידה קרבית"
                checked={form.isCombat}
                onChange={v => setForm(f => ({ ...f, isCombat: v }))}
              />
            </div>
          </div>

          {/* Personal details */}
          <div>
            <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">פרטים אישיים</h2>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="שם פרטי"
                required
                value={form.firstName}
                onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                className="w-full bg-white border-2 border-gray-200 rounded-2xl px-3 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-terracotta-400 focus:outline-none transition-colors text-right"
              />
              <input
                type="text"
                placeholder="שם משפחה"
                required
                value={form.lastName}
                onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                className="w-full bg-white border-2 border-gray-200 rounded-2xl px-3 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-terracotta-400 focus:outline-none transition-colors text-right"
              />
              <input
                type="tel"
                placeholder="מספר טלפון"
                required
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full bg-white border-2 border-gray-200 rounded-2xl px-3 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-terracotta-400 focus:outline-none transition-colors text-right"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-terracotta-500 active:scale-95 text-white font-bold py-3.5 rounded-2xl shadow-lg transition-all duration-200"
          >
            בואו נראה מה מגיע לי ←
          </button>
        </form>
      </div>
    </div>
  );
}
