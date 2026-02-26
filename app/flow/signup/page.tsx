'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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
      <span className={`font-medium text-sm text-right ${checked ? 'text-terracotta-800' : 'text-gray-700'}`}>
        {label}
      </span>
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

type Step = 'form' | 'otp' | 'loading';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('form');
  const [form, setForm] = useState<FormData>({
    isReservist: false,
    hasProperty: false,
    isCombat: false,
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep('loading');
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/request-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ANON_KEY}`,
        },
        body: JSON.stringify({
          phone: form.phone,
          firstName: form.firstName,
          lastName: form.lastName,
          isReservist: form.isReservist,
          hasProperty: form.hasProperty,
          isCombat: form.isCombat,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const messages: Record<string, string> = {
          rate_limit_exceeded: 'שלחנו יותר מדי קודים. נסו שוב עוד שעה.',
          invalid_phone: 'מספר הטלפון לא תקין.',
        };
        setOtpError(messages[data.error] || 'שגיאה בשליחת הקוד. נסו שוב.');
        setStep('form');
        return;
      }
      setStep('otp');
      startResendCooldown();
    } catch {
      setOtpError('שגיאה בחיבור. נסו שוב.');
      setStep('form');
    }
  }

  function startResendCooldown() {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown(n => {
        if (n <= 1) { clearInterval(interval); return 0; }
        return n - 1;
      });
    }, 1000);
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    setOtpError('');
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/request-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ANON_KEY}`,
        },
        body: JSON.stringify({
          phone: form.phone,
          firstName: form.firstName,
          lastName: form.lastName,
          isReservist: form.isReservist,
          hasProperty: form.hasProperty,
          isCombat: form.isCombat,
        }),
      });
      if (res.ok) startResendCooldown();
    } catch {
      // silent fail
    }
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOtpError('');
    setOtpLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ANON_KEY}`,
        },
        body: JSON.stringify({ phone: form.phone, code: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        const messages: Record<string, string> = {
          invalid_code: 'קוד שגוי. נסו שוב.',
          expired_code: 'הקוד פג תוקף. שלחו קוד חדש.',
        };
        setOtpError(messages[data.error] || 'שגיאה. נסו שוב.');
        setOtpLoading(false);
        return;
      }
      // Store tokens
      const { access_token, refresh_token } = data;
      localStorage.setItem('sb-access-token', access_token);
      localStorage.setItem('sb-refresh-token', refresh_token);
      // Set cookie for middleware (30 day expiry)
      document.cookie = `sb-access-token=${access_token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
      router.push('/flow/tenders');
    } catch {
      setOtpError('שגיאה בחיבור. נסו שוב.');
      setOtpLoading(false);
    }
  }

  const lastFourDigits = form.phone.replace(/\D/g, '').slice(-4);

  // Loading screen
  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex flex-col items-center justify-center" dir="rtl">
        <div className="text-6xl mb-5 animate-bounce">📱</div>
        <h2 className="text-xl font-bold text-terracotta-700 mb-1">שולחים קוד...</h2>
        <p className="text-gray-500 text-sm">רגע אחד</p>
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

  // OTP screen
  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white" dir="rtl">
        <div className="px-5 pt-8 pb-8 max-w-md mx-auto">
          <button
            onClick={() => { setStep('form'); setOtpCode(''); setOtpError(''); }}
            className="text-gray-400 text-sm mb-4 flex items-center gap-1"
          >
            → חזרה
          </button>

          <div className="text-5xl mb-4 text-center">💬</div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1 text-center">הכנסו את הקוד</h1>
          <p className="text-gray-500 text-sm mb-6 text-center">
            שלחנו קוד אימות למספר המסתיים ב־{lastFourDigits}
          </p>

          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="000000"
              maxLength={6}
              required
              value={otpCode}
              onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-white border-2 border-gray-200 rounded-2xl px-4 py-4 text-2xl font-bold text-center tracking-widest text-gray-800 placeholder-gray-300 focus:border-terracotta-400 focus:outline-none transition-colors"
              autoFocus
            />

            {otpError && (
              <p className="text-red-500 text-sm text-center">{otpError}</p>
            )}

            <button
              type="submit"
              disabled={otpLoading || otpCode.length < 6}
              className="w-full bg-terracotta-500 active:scale-95 text-white font-bold py-3.5 rounded-2xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {otpLoading ? 'מאמתים...' : 'אמתו את הקוד ←'}
            </button>
          </form>

          <div className="mt-6 text-center">
            {resendCooldown > 0 ? (
              <p className="text-gray-400 text-sm">שלח שוב בעוד {resendCooldown} שניות</p>
            ) : (
              <button
                onClick={handleResend}
                className="text-terracotta-500 text-sm font-medium underline"
              >
                שלחו קוד חדש
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Form screen
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

        {otpError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-600 text-sm">
            {otpError}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-5">

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
