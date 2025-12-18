'use client';

import { ProcessedTender } from '@/utils/tenderProcessing';
import TenderCard from './TenderCard';

interface TenderListProps {
  tenders: ProcessedTender[];
  selectedCityCode: number | null;
  hoveredTenderId: number | null;
  onTenderHover: (tenderId: number | null) => void;
  onTenderClick: (tender: ProcessedTender) => void;
  onClearFilters: () => void;
}

export default function TenderList({
  tenders,
  selectedCityCode,
  hoveredTenderId,
  onTenderHover,
  onTenderClick,
  onClearFilters,
}: TenderListProps) {
  const isFiltered = selectedCityCode !== null;

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-white/50 to-terracotta-50/30">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-200 p-6">
        {/* Logo */}
        <div className="flex items-center justify-end gap-2 mb-4">
          <span className="text-lg font-bold text-gray-900">Land Tenders</span>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-terracotta-500 to-terracotta-600 flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-right flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {isFiltered ? 'מכרזים מסוננים' : 'כל המכרזים'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {tenders.length} {tenders.length === 1 ? 'מכרז' : 'מכרזים'} זמינים
            </p>
          </div>

          {isFiltered && (
            <button
              onClick={onClearFilters}
              className="btn-secondary text-sm px-4 py-2 mr-4"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                נקה סינון
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Tender Cards List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {tenders.length === 0 ? (
          <div className="card-container p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">לא נמצאו מכרזים</h3>
            <p className="text-gray-600 mb-6">
              {isFiltered
                ? 'לא מצאנו מכרזים באזור זה. נסו לבחור עיר אחרת או לנקות את הסינון.'
                : 'המכרזים נטענים... נא רענן את הדף.'}
            </p>
            {isFiltered && (
              <button onClick={onClearFilters} className="btn-primary">
                נקה סינון
              </button>
            )}
          </div>
        ) : (
          tenders.map((tender, index) => (
            <div
              key={`${tender.michraz_id}-${index}`}
              className="animate-slide-up"
              style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
            >
              <TenderCard
                tender={tender}
                isHovered={hoveredTenderId === tender.michraz_id}
                onHover={() => onTenderHover(tender.michraz_id)}
                onLeave={() => onTenderHover(null)}
                onClick={() => onTenderClick(tender)}
              />
            </div>
          ))
        )}
      </div>

      {/* Footer Stats */}
      {tenders.length > 0 && (
        <div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-gray-200">
          <div className="p-4">
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span>
                  <span className="font-semibold text-gray-900">
                    {tenders.reduce((sum, t) => sum + t.lot_count, 0)}
                  </span>{' '}
                  סה״כ מגרשים
                </span>
                <div className="w-2 h-2 bg-terracotta-500 rounded-full"></div>
              </div>
              <div className="flex items-center gap-2">
                <span>
                  <span className="font-semibold text-gray-900">
                    {tenders.filter((t) => t.has_lots).length}
                  </span>{' '}
                  מכרזים פעילים
                </span>
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 px-4 py-3 text-center">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Land Tenders • מכרזי קרקעות רמ״י
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
