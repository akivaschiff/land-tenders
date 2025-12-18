'use client';

import { ProcessedTender } from '@/utils/tenderProcessing';
import { formatPriceRange, formatSizeRange } from '@/utils/formatters';

interface TenderCardProps {
  tender: ProcessedTender;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}

export default function TenderCard({ tender, isHovered, onHover, onLeave, onClick }: TenderCardProps) {
  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      className={`card-container p-6 cursor-pointer transition-all duration-300 text-right ${
        isHovered ? 'ring-2 ring-terracotta-500 shadow-2xl scale-[1.02]' : ''
      }`}
    >
      {/* City and Neighborhood */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 text-right">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {tender.city_name}
            {tender.neighborhood && (
              <span className="text-gray-600 font-normal">، {tender.neighborhood}</span>
            )}
          </h3>
          <p className="text-xs text-gray-500">מכרז {tender.michraz_name}</p>
        </div>

        {/* Details Pending Badge */}
        {(!tender.has_lots ||
          tender.price_range.min === 0 ||
          tender.price_range.max === 0 ||
          tender.size_range.min === 0 ||
          tender.size_range.max === 0) && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200 ml-3">
            פרטים בקרוב
          </span>
        )}
      </div>

      {/* Tender Details */}
      {tender.has_lots ? (
        <div className="grid grid-cols-3 gap-3 text-sm">
          {/* Lot Count */}
          <div className="flex flex-col items-end gap-1 text-right" dir="ltr">
            <div className="flex items-center gap-1 text-gray-500">
              <svg className="w-3.5 h-3.5 text-terracotta-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-xs">מגרשים</span>
            </div>
            <span className="font-semibold text-gray-900">{tender.lot_count}</span>
          </div>

          {/* Size Range */}
          {tender.size_range.min > 0 && tender.size_range.max > 0 ? (
            <div className="flex flex-col items-end gap-1 text-right" dir="ltr">
              <div className="flex items-center gap-1 text-gray-500">
                <svg className="w-3.5 h-3.5 text-sage-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span className="text-xs">מ״ר</span>
              </div>
              <span className="font-semibold text-gray-900 text-xs leading-tight">
                {tender.size_range.min}-{tender.size_range.max}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-end gap-1 text-right" dir="ltr">
              <div className="flex items-center gap-1 text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span className="text-xs">מ״ר</span>
              </div>
              <span className="text-xs text-gray-400">-</span>
            </div>
          )}

          {/* Price Range */}
          {tender.price_range.min > 0 && tender.price_range.max > 0 ? (
            <div className="flex flex-col items-end gap-1 text-right" dir="ltr">
              <div className="flex items-center gap-1 text-gray-500">
                <svg className="w-3.5 h-3.5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span className="text-xs">₪ אלפים</span>
              </div>
              <span className="font-semibold text-gray-900 text-xs leading-tight">
                {Math.round(tender.price_range.min / 1000)}-{Math.round(tender.price_range.max / 1000)}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-end gap-1 text-right" dir="ltr">
              <div className="flex items-center gap-1 text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span className="text-xs">₪ אלפים</span>
              </div>
              <span className="text-xs text-gray-400">-</span>
            </div>
          )}
        </div>
      ) : (
        <div className="text-sm text-gray-500">
          <div className="flex items-center gap-2 flex-row-reverse">
            <span>אין מגרשים זמינים עדיין</span>
            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      )}

      {/* Location indicator (only shows when not hovered) */}
      {!tender.coordinates && !isHovered && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-amber-600 flex-row-reverse">
            <span>מיקום במפה לא זמין</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
