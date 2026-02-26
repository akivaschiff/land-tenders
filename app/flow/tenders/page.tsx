'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwCn3K0xwhPg_Fnu88Hl5eKWAnW3pf6RyZ1SZaYyMB6vOSeJyhN1k-xoTtZ5tyyLqds/exec';

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
const WHATSAPP_NUMBER = '972506727669';
const CONTACT_EMAIL = 'tami@mitrani.co.il';

interface TenderMetadata {
  id?: string;
  location?: string;
  neighborhood?: string;
  closing_date?: string;
  start_building_date?: string;
}

interface PlotData {
  plot_id: number;
  size: number;
  build_permit: number;
  total_value: number;
  development_fee: number;
  discounted_value_no_estate: number;
  reservist: number;
  reservist_no_estate: number;
  combat: number;
}

interface SheetData {
  metadata: TenderMetadata;
  data: PlotData[];
}

type SheetsResponse = Record<string, SheetData>;

function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('he-IL').format(Math.round(num));
}

function getDaysUntilClosing(closingDate: string | undefined): number | null {
  if (!closingDate) return null;
  try {
    const date = new Date(closingDate);
    if (isNaN(date.getTime())) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  } catch {
    return null;
  }
}

function closingLabel(days: number | null): string {
  if (days === null) return '';
  if (days < 0) return 'נסגר';
  if (days === 0) return 'נסגר היום';
  if (days === 1) return 'נסגר מחר';
  return `נסגר בעוד ${days} ימים`;
}

// ── Email Signup Popup ──────────────────────────────────────────────
function EmailSignupPopup({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const supabase = getSupabaseClient();
      // Restore session from localStorage so the insert is authenticated
      const accessToken = localStorage.getItem('sb-access-token');
      const refreshToken = localStorage.getItem('sb-refresh-token');
      if (accessToken && refreshToken) {
        await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
      }
      await supabase.from('email_signups').insert({ email });
    } catch {
      // Non-fatal: proceed to success state even if insert fails
    }
    setSaving(false);
    setDone(true);
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl w-full max-w-md p-6 pb-10 animate-slide-up"
        onClick={e => e.stopPropagation()}
        dir="rtl"
      >
        {!done ? (
          <>
            <div className="text-4xl mb-4 text-center">📬</div>
            <p className="text-gray-800 text-base font-semibold text-center mb-5">
              נודיע לך מיד כשמכרז חדש נפתח
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="כתובת מייל"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-right focus:border-terracotta-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={saving || !isEmailValid}
                className="w-full bg-terracotta-500 text-white font-bold py-3 rounded-2xl active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saving ? 'שומר...' : 'אשמח לקבל עדכונים'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">נרשמת בהצלחה!</h2>
            <p className="text-gray-500 text-sm mb-5">נעדכן אותך על כל מכרז חדש</p>
            <button
              onClick={onClose}
              className="bg-terracotta-500 text-white font-bold px-8 py-3 rounded-2xl active:scale-95 transition-all"
            >
              סגור
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Contact / "Coming Soon" Popup ───────────────────────────────────
function ContactPopup({ tender, onClose }: { tender: SheetData; onClose: () => void }) {
  const waMessage = encodeURIComponent(`היי! ראיתי את מכרז ${tender.metadata.location} ורוצה לשמוע עוד 🏡`);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl w-full max-w-md p-6 pb-10 animate-slide-up"
        onClick={e => e.stopPropagation()}
        dir="rtl"
      >
        <div className="text-4xl mb-3 text-center">🏗️</div>
        <h2 className="text-xl font-bold text-gray-900 text-center mb-1">הפלטפורמה הדיגיטלית בדרך!</h2>
        <p className="text-gray-500 text-sm text-center mb-1">
          אנחנו בונים את הזרימה הדיגיטלית המלאה.
        </p>
        <p className="text-gray-500 text-sm text-center mb-6">
          עד שתהיה מוכנה — נשמח לעזור לכם אישית.
        </p>
        <div className="space-y-3">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-green-500 text-white font-bold py-3.5 rounded-2xl active:scale-95 transition-all"
          >
            <span className="text-xl">💬</span>
            שלחו הודעה בוואטסאפ
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=התעניינות במכרז ${tender.metadata.location}`}
            className="flex items-center justify-center gap-2 w-full bg-white border-2 border-gray-200 text-gray-700 font-bold py-3.5 rounded-2xl active:scale-95 transition-all"
          >
            <span className="text-xl">✉️</span>
            שלחו מייל
          </a>
        </div>
        <button onClick={onClose} className="w-full text-gray-400 text-sm mt-4 py-2">
          בטל
        </button>
      </div>
    </div>
  );
}

// ── Tender Detail Sheet ─────────────────────────────────────────────
function TenderDetailSheet({
  tender,
  onClose,
  onInterested,
}: {
  tender: SheetData;
  onClose: () => void;
  onInterested: () => void;
}) {
  const days = getDaysUntilClosing(tender.metadata.closing_date);

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-end justify-center" onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl w-full max-w-md flex flex-col animate-slide-up"
        style={{ maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-extrabold text-terracotta-700">{tender.metadata.location}</h2>
              {tender.metadata.neighborhood && (
                <p className="text-sm text-gray-500">{tender.metadata.neighborhood}</p>
              )}
              {tender.metadata.id && (
                <p className="text-xs text-gray-400 mt-0.5">מכרז {tender.metadata.id}</p>
              )}
            </div>
            {days !== null && (
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                days < 0 ? 'bg-gray-100 text-gray-500' :
                days <= 7 ? 'bg-red-100 text-red-600' :
                'bg-amber-100 text-amber-700'
              }`}>
                {closingLabel(days)}
              </span>
            )}
          </div>
        </div>

        {/* Plots list */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">מגרשים</h3>
          {tender.data.map(plot => (
            <div
              key={plot.plot_id}
              className="bg-gradient-to-br from-white to-amber-50/30 rounded-2xl border border-terracotta-100 p-4"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-gray-400">מגרש {plot.plot_id}</span>
                <span className="text-lg font-extrabold text-amber-600">₪{formatNumber(plot.total_value)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-sage-50 rounded-xl px-3 py-2">
                  <div className="text-xs text-sage-600 font-medium">שטח קרקע</div>
                  <div className="font-bold text-sage-800">{formatNumber(plot.size)} מ״ר</div>
                </div>
                <div className="bg-sky-50 rounded-xl px-3 py-2">
                  <div className="text-xs text-sky-600 font-medium">שטח בנייה</div>
                  <div className="font-bold text-sky-800">{formatNumber(plot.build_permit)} מ״ר</div>
                </div>
                {plot.reservist > 0 && (
                  <div className="bg-terracotta-50 rounded-xl px-3 py-2">
                    <div className="text-xs text-terracotta-600 font-medium">הנחת מילואים</div>
                    <div className="font-bold text-terracotta-800">₪{formatNumber(plot.reservist)}</div>
                  </div>
                )}
                {plot.combat > 0 && (
                  <div className="bg-amber-50 rounded-xl px-3 py-2">
                    <div className="text-xs text-amber-600 font-medium">הנחה קרבית</div>
                    <div className="font-bold text-amber-800">₪{formatNumber(plot.combat)}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="px-5 pb-8 pt-4 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={onInterested}
            className="w-full bg-terracotta-500 hover:bg-terracotta-600 active:scale-95 text-white font-bold py-4 rounded-2xl shadow-lg transition-all duration-200 text-lg"
          >
            מעניין אותי — אשמח לפרטים
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────
export default function TendersPage() {
  const [tenders, setTenders] = useState<SheetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [selectedTender, setSelectedTender] = useState<SheetData | null>(null);
  const [showContactPopup, setShowContactPopup] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(SCRIPT_URL);
        if (!response.ok) throw new Error('Failed to fetch');
        const sheets: SheetsResponse = await response.json();

        const valid = Object.values(sheets).filter(sheet => {
          const id = sheet.metadata?.id;
          return id !== null && id !== undefined && id !== '';
        });

        // Sort: open tenders by soonest closing first, closed tenders at bottom
        valid.sort((a, b) => {
          const dA = getDaysUntilClosing(a.metadata.closing_date) ?? 9999;
          const dB = getDaysUntilClosing(b.metadata.closing_date) ?? 9999;
          if (dA < 0 && dB < 0) return dB - dA;
          if (dA < 0) return 1;
          if (dB < 0) return -1;
          return dA - dB;
        });

        setTenders(valid);
      } catch {
        setError('שגיאה בטעינת הנתונים');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-sage-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">🏡</div>
          <div className="text-xl text-terracotta-600 font-medium">טוען מכרזים...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-sage-50 flex items-center justify-center" dir="rtl">
        <div className="text-xl text-red-600 font-medium">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-sage-50" dir="rtl">
      <div className="px-4 py-8">

        {/* CTA Card */}
        <div className="max-w-md mx-auto mb-6">
          <div className="relative bg-gradient-to-br from-terracotta-500 to-terracotta-600 rounded-2xl shadow-lg p-6 overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-8 -translate-y-8" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-6 translate-y-6" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl">🔔</span>
                <h2 className="text-2xl font-bold text-white">התרעות חכמות</h2>
              </div>
              <p className="text-amber-50 text-base mb-4 leading-relaxed">
                המערכת תשלח לך התרעה ברגע שהמדינה פותחת מכרז חדש שיכול להיות{' '}
                <span className="whitespace-nowrap">רלוונטי אליך 💪</span>
              </p>
              <button
                onClick={() => setShowEmailPopup(true)}
                className="w-full bg-white text-terracotta-600 font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all duration-200"
              >
                אשמח לקבל עדכונים 📬
              </button>
            </div>
          </div>
        </div>

        {/* Tender Cards */}
        <div className="flex flex-col gap-3 max-w-md mx-auto">
          {tenders.map((tender, index) => {
            const sizes = tender.data.map(r => r.size).filter(v => v > 0);
            const permits = tender.data.map(r => r.build_permit).filter(v => v > 0);
            const values = tender.data.map(r => r.total_value).filter(v => v > 0);

            const medianSize = calculateMedian(sizes);
            const medianPermit = calculateMedian(permits);
            const medianValue = calculateMedian(values);
            const days = getDaysUntilClosing(tender.metadata.closing_date);
            const closing = closingLabel(days);
            const isClosed = days !== null && days < 0;

            return (
              <div
                key={index}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setSelectedTender(tender)}
                className={`group relative bg-gradient-to-br from-white to-amber-50/30 rounded-2xl shadow-sm active:scale-[0.98] transition-all duration-300 p-4 border overflow-hidden animate-fade-in cursor-pointer ${
                  isClosed ? 'border-gray-200 opacity-60' : 'border-terracotta-200/40 hover:shadow-md'
                }`}
              >
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-terracotta-400/20 to-transparent rounded-bl-full transition-transform duration-500 group-hover:scale-150 group-active:scale-125" />

                {/* Row 1 */}
                <div className="relative flex justify-between items-start mb-3">
                  <h2 className="text-xl font-bold text-terracotta-600">{tender.metadata.location}</h2>
                  <div className="text-right bg-sage-50 px-3 py-1.5 rounded-xl border border-sage-200/50 w-24">
                    <div className="text-base font-bold text-sage-700">{medianSize > 0 ? formatNumber(medianSize) : '-'}</div>
                    <div className="text-[10px] text-sage-600/70 uppercase tracking-wide font-medium">מ״ר שטח</div>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="flex justify-between items-end mb-2">
                  <div className="text-right">
                    <div className="text-2xl font-extrabold bg-gradient-to-l from-amber-600 to-amber-500 bg-clip-text text-transparent leading-tight">
                      {medianValue > 0 ? `₪${formatNumber(medianValue)}` : '-'}
                    </div>
                  </div>
                  <div className="text-left flex items-center gap-1.5 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200/50 w-24">
                    <div className="flex flex-col items-start">
                      <div className="text-base font-bold text-sky-700">{medianPermit > 0 ? formatNumber(medianPermit) : '-'}</div>
                      <div className="text-[10px] text-sky-600/70 uppercase tracking-wide font-medium">מ״ר בית</div>
                    </div>
                    <span className="text-lg">🏠</span>
                  </div>
                </div>

                {closing && (
                  <div className={`text-right text-[11px] font-medium mt-2 ${isClosed ? 'text-gray-400' : 'text-terracotta-400 opacity-70'}`}>
                    {closing}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {tenders.length === 0 && (
          <div className="text-center text-gray-600 text-xl mt-12">לא נמצאו מכרזים</div>
        )}
      </div>

      {/* Modals */}
      {showEmailPopup && <EmailSignupPopup onClose={() => setShowEmailPopup(false)} />}

      {selectedTender && !showContactPopup && (
        <TenderDetailSheet
          tender={selectedTender}
          onClose={() => setSelectedTender(null)}
          onInterested={() => setShowContactPopup(true)}
        />
      )}

      {selectedTender && showContactPopup && (
        <ContactPopup
          tender={selectedTender}
          onClose={() => { setShowContactPopup(false); setSelectedTender(null); }}
        />
      )}
    </div>
  );
}
