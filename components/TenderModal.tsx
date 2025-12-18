'use client';

import { ProcessedTender, RawTender } from '@/utils/tenderProcessing';
import { parseCommaSeparatedNumber } from '@/utils/formatters';
import { useEffect } from 'react';

interface TenderModalProps {
  tender: ProcessedTender;
  rawTender: RawTender | null;
  onClose: () => void;
}

export default function TenderModal({ tender, rawTender, onClose }: TenderModalProps) {
  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const formatPrice = (priceStr: string) => {
    const num = parseCommaSeparatedNumber(priceStr);
    if (num === 0) return '-';
    return `₪${(num / 1000).toLocaleString('he-IL', { maximumFractionDigits: 0 })}k`;
  };

  const formatSize = (sizeStr: string) => {
    const num = parseCommaSeparatedNumber(sizeStr);
    if (num === 0) return '-';
    return num.toLocaleString('he-IL');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-l from-terracotta-500 to-terracotta-600 text-white p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 text-right">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                {tender.city_name}
                {tender.neighborhood && (
                  <span className="text-terracotta-100">، {tender.neighborhood}</span>
                )}
              </h2>
              <p className="text-terracotta-100 text-sm md:text-base">
                מכרז {tender.michraz_name} • מכרז מספר {tender.michraz_id}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              aria-label="סגור"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Summary Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3">
              <div className="text-2xl font-bold">{tender.lot_count}</div>
              <div className="text-xs text-terracotta-100 mt-1">מגרשים</div>
            </div>
            {tender.size_range.min > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3">
                <div className="text-lg font-bold">{tender.size_range.min}-{tender.size_range.max}</div>
                <div className="text-xs text-terracotta-100 mt-1">מ״ר</div>
              </div>
            )}
            {tender.price_range.min > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3">
                <div className="text-lg font-bold">
                  ₪{Math.round(tender.price_range.min / 1000)}-{Math.round(tender.price_range.max / 1000)}k
                </div>
                <div className="text-xs text-terracotta-100 mt-1">טווח מחירים</div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 md:p-8" style={{ maxHeight: 'calc(90vh - 280px)' }}>
          {!tender.has_lots || !rawTender ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-amber-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">פרטים בקרוב</h3>
              <p className="text-gray-600">פרטי המגרשים יתפרסמו בהמשך</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 text-right mb-4">רשימת מגרשים</h3>

              {/* Responsive table wrapper */}
              <div className="overflow-x-auto -mx-6 md:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-gray-200" dir="rtl">
                    <thead className="bg-gradient-to-l from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          מגרש
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          שטח (מ״ר)
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          מחיר מלא
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                          מילואים ללא בית
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                          מילואים עם בית
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                          קרבי ללא בית
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                          סה״כ פיתוח
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {rawTender.plots.map((plot, index) => (
                        <tr
                          key={index}
                          className="hover:bg-terracotta-50/50 transition-colors"
                        >
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-terracotta-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-bold text-terracotta-700">
                                  {plot.lot_number}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-sm font-semibold text-gray-900">
                              {formatSize(plot.lot_size)}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-sm font-bold text-sky-600">
                              {formatPrice(plot.full_value)}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                            <span className="text-sm text-gray-700">
                              {formatPrice(plot.value_reservist_no_house)}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                            <span className="text-sm text-gray-700">
                              {formatPrice(plot.value_reservist_with_house)}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                            <span className="text-sm text-gray-700">
                              {formatPrice(plot.value_combat_no_house)}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                            <span className="text-sm text-amber-600 font-medium">
                              {formatPrice(plot.total_development)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile-friendly info cards for additional details */}
              <div className="md:hidden mt-6 space-y-3">
                <p className="text-xs text-gray-500 text-right">
                  גלול שמאלה לראות מחירי הנחה נוספים ופיתוח
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
