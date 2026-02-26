'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const PAGE_STYLE: React.CSSProperties = {
  fontFamily: "'Heebo', 'Arial Hebrew', sans-serif",
};

interface FormData {
  isReservist: boolean;
  hasProperty: boolean;
  isCombat: boolean;
  firstName: string;
  lastName: string;
  phone: string;
}

type Step = 'form' | 'sending' | 'otp';

function ToggleCard({
  label, sub, icon, checked, onChange,
}: {
  label: string; sub?: string; icon: string;
  checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 text-right transition-all duration-200 ${
        checked ? 'bg-terracotta-50 border-terracotta-400 shadow-sm' : 'bg-white border-gray-200'
      }`}
    >
      <div className={`text-xl flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${checked ? 'bg-terracotta-100' : 'bg-gray-100'}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0 text-right">
        <p className={`font-bold text-sm ${checked ? 'text-terracotta-800' : 'text-gray-800'}`}>{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      <div dir="ltr" className={`relative w-10 h-5 rounded-full flex-shrink-0 transition-colors duration-200 ${checked ? 'bg-terracotta-500' : 'bg-gray-200'}`}>
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
    </button>
  );
}

function LabeledInput({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-400 mb-1 pr-1 text-right">{label}</label>
      <input
        {...props}
        className="w-full bg-white border-2 border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:border-terracotta-400 focus:outline-none transition-colors text-right"
      />
    </div>
  );
}

function StepDots({ current }: { current: 1 | 2 }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8" dir="ltr">
      <div className={`h-1.5 rounded-full transition-all duration-300 ${current === 1 ? 'w-8 bg-terracotta-500' : 'w-4 bg-gray-200'}`} />
      <div className={`h-1.5 rounded-full transition-all duration-300 ${current === 2 ? 'w-8 bg-terracotta-500' : 'w-4 bg-gray-200'}`} />
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('form');
  const [form, setForm] = useState<FormData>({
    isReservist: false, hasProperty: false, isCombat: false,
    firstName: '', lastName: '', phone: '',
  });
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [formError, setFormError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  async function requestOtp(silent = false) {
    if (!silent) setStep('sending');
    setFormError('');
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ANON_KEY}` },
        body: JSON.stringify({ phone: form.phone, firstName: form.firstName, lastName: form.lastName, isReservist: form.isReservist, hasProperty: form.hasProperty, isCombat: form.isCombat }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg: Record<string, string> = {
          rate_limit_exceeded: 'שלחנו יותר מדי קודים. נסו שוב בעוד שעה.',
          invalid_phone: 'מספר הטלפון לא תקין.',
        };
        setFormError(msg[data.error] || 'שגיאה בשליחת הקוד. נסו שוב.');
        setStep('form');
        return false;
      }
      startResendCooldown();
      return true;
    } catch {
      setFormError('שגיאה בחיבור לשרת. נסו שוב.');
      setStep('form');
      return false;
    }
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await requestOtp();
    if (ok) setStep('otp');
  }

  function startResendCooldown() {
    setResendCooldown(59);
    const iv = setInterval(() => {
      setResendCooldown(n => { if (n <= 1) { clearInterval(iv); return 0; } return n - 1; });
    }, 1000);
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    setOtpError('');
    await requestOtp(true);
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOtpError('');
    setOtpLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ANON_KEY}` },
        body: JSON.stringify({ phone: form.phone, code: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg: Record<string, string> = { invalid_code: 'הקוד שגוי. נסו שוב.', expired_code: 'הקוד פג תוקף. שלחו קוד חדש.' };
        setOtpError(msg[data.error] || 'משהו השתבש. נסו שנית.');
        setOtpLoading(false);
        return;
      }
      const { access_token, refresh_token } = data;
      localStorage.setItem('sb-access-token', access_token);
      localStorage.setItem('sb-refresh-token', refresh_token);
      document.cookie = `sb-access-token=${access_token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
      router.push('/flow/tenders');
    } catch {
      setOtpError('שגיאה בחיבור. נסו שוב.');
      setOtpLoading(false);
    }
  }

  const displayPhone = form.phone.replace(/\D/g, '').slice(-4);

  // ── Sending ──────────────────────────────────────────────────────
  if (step === 'sending') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fff8f0] to-white flex flex-col items-center justify-center overflow-hidden" dir="rtl" style={PAGE_STYLE}>
        <div className="text-5xl mb-5 animate-bounce">📱</div>
        <h2 className="text-xl font-black text-gray-900 mb-1">שולחים קוד לטלפון...</h2>
        <p className="text-gray-400 text-sm">רק שנייה</p>
        <div className="mt-6 flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2 h-2 bg-terracotta-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    );
  }

  // ── OTP ──────────────────────────────────────────────────────────
  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fff8f0] to-white overflow-hidden w-full" dir="rtl" style={PAGE_STYLE}>
        <div className="h-1 w-full bg-gradient-to-l from-terracotta-400 via-amber-400 to-terracotta-600" />
        <div className="px-5 pt-8 pb-12 w-full">
          <button onClick={() => { setStep('form'); setOtpCode(''); setOtpError(''); }} className="text-gray-300 text-sm mb-8 flex items-center gap-1.5 hover:text-gray-500 transition-colors">
            <span>→</span> חזרה
          </button>

          <StepDots current={2} />

          <div className="text-center mb-8">
            <div className="text-5xl mb-4">💬</div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">הכנס/י את הקוד</h1>
            <p className="text-gray-400 text-sm">
              שלחנו 6 ספרות למספר המסתיים ב-<span className="font-black text-gray-600 tracking-widest">{displayPhone}</span>
            </p>
          </div>

          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="— — — — — —"
              maxLength={6}
              required
              value={otpCode}
              onChange={e => { setOtpError(''); setOtpCode(e.target.value.replace(/\D/g, '')); }}
              autoFocus
              className={`w-full bg-white border-2 rounded-2xl px-4 py-5 text-3xl font-black text-center tracking-[0.4em] text-gray-900 placeholder-gray-200 focus:outline-none transition-all duration-200 ${
                otpError ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-terracotta-400'
              }`}
            />

            {otpError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 text-sm text-red-500">
                ⚠️ {otpError}
              </div>
            )}

            <button
              type="submit"
              disabled={otpLoading || otpCode.length < 6}
              className="w-full bg-terracotta-500 active:scale-[0.98] text-white font-extrabold py-4 rounded-2xl shadow-lg text-lg transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {otpLoading ? 'מאמתים...' : 'אמתו וקדמו ←'}
            </button>
          </form>

          <div className="mt-6 text-center">
            {resendCooldown > 0 ? (
              <p className="text-gray-300 text-sm">שלח קוד חדש בעוד <span className="font-bold text-gray-400">{resendCooldown}</span> שניות</p>
            ) : (
              <button onClick={handleResend} className="text-terracotta-500 text-sm font-bold underline underline-offset-2">שלח/י קוד חדש</button>
            )}
          </div>
          <p className="text-center text-xs text-gray-300 mt-8">המספר לא יועבר לאף גורם שלישי</p>
        </div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff8f0] to-white overflow-hidden w-full" dir="rtl" style={PAGE_STYLE}>
      <div className="h-1 w-full bg-gradient-to-l from-terracotta-400 via-amber-400 to-terracotta-600" />
      <div className="px-5 pt-8 pb-12 w-full">

        <button onClick={() => router.back()} className="text-gray-300 text-sm mb-8 flex items-center gap-1.5 hover:text-gray-500 transition-colors">
          <span>→</span> חזרה
        </button>

        <StepDots current={1} />

        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900 mb-1">ספר/י לנו עליך</h1>
          <p className="text-gray-400 text-sm">כדי לדעת בדיוק כמה מגיע לך</p>
        </div>

        {formError && (
          <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-500">
            ⚠️ {formError}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div>
            <p className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-2.5">זכאות — סמן/י מה שמתאים לך</p>
            <div className="space-y-2">
              <ToggleCard icon="🎖️" label="אני בשירות מילואים" sub="פעיל/ה בשנה האחרונה" checked={form.isReservist} onChange={v => setForm(f => ({ ...f, isReservist: v }))} />
              <ToggleCard icon="🏠" label="יש לי כבר נכס ברשותי" sub="דירה, קרקע, או נכס אחר" checked={form.hasProperty} onChange={v => setForm(f => ({ ...f, hasProperty: v }))} />
              <ToggleCard icon="🪖" label="שירתי ביחידה קרבית" sub='לוחם/ת, צנחן/ית, מג"ד ומעלה' checked={form.isCombat} onChange={v => setForm(f => ({ ...f, isCombat: v }))} />
            </div>
          </div>

          <div>
            <p className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-2.5">פרטים אישיים</p>
            <div className="space-y-3">
              {/* Two name fields side by side */}
              <div className="flex gap-3">
                <div className="flex-1 min-w-0">
                  <LabeledInput label="שם פרטי" type="text" placeholder="ישראל" required value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
                </div>
                <div className="flex-1 min-w-0">
                  <LabeledInput label="שם משפחה" type="text" placeholder="ישראלי" required value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
                </div>
              </div>
              <LabeledInput label="מספר טלפון" type="tel" placeholder="05X-XXXXXXX" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
          </div>

          <div>
            <button type="submit" className="w-full bg-terracotta-500 active:scale-[0.98] text-white font-extrabold py-4 rounded-2xl shadow-lg text-lg transition-all duration-150">
              קבלו קוד SMS ←
            </button>
            <p className="text-center text-xs text-gray-300 mt-2.5">נשלח קוד לטלפון · זה לוקח 30 שניות</p>
          </div>
        </form>
      </div>
    </div>
  );
}
