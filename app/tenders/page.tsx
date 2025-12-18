'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import TenderList from '@/components/TenderList';
import TenderModal from '@/components/TenderModal';
import {
  processTenders,
  aggregateTendersByCity,
  filterTenders,
  type ProcessedTender,
  type RawTender,
  type CityAggregate,
} from '@/utils/tenderProcessing';

// Dynamically import the map component with SSR disabled
const TenderMap = dynamic(() => import('@/components/TenderMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sage-50 to-sky-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-terracotta-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">טוען מפה...</p>
      </div>
    </div>
  ),
});

export default function TendersPage() {
  const [processedTenders, setProcessedTenders] = useState<ProcessedTender[]>([]);
  const [rawTenders, setRawTenders] = useState<RawTender[]>([]);
  const [filteredTenders, setFilteredTenders] = useState<ProcessedTender[]>([]);
  const [hoveredTenderId, setHoveredTenderId] = useState<number | null>(null);
  const [selectedCityCode, setSelectedCityCode] = useState<number | null>(null);
  const [selectedTender, setSelectedTender] = useState<ProcessedTender | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load and process tender data
  useEffect(() => {
    async function loadTenders() {
      try {
        const response = await fetch('/tenders_output.json');
        if (!response.ok) {
          throw new Error('Failed to load tender data');
        }

        const rawData: RawTender[] = await response.json();
        const processed = processTenders(rawData);

        setRawTenders(rawData);
        setProcessedTenders(processed);
        setFilteredTenders(processed);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading tenders:', err);
        setError(err instanceof Error ? err.message : 'Failed to load tenders');
        setIsLoading(false);
      }
    }

    loadTenders();
  }, []);

  // Update filtered tenders when filters change
  useEffect(() => {
    const filtered = filterTenders(processedTenders, {
      cityCode: selectedCityCode,
    });

    // Sort tenders: complete ones first, incomplete ones last
    const sorted = filtered.sort((a, b) => {
      const aIncomplete = !a.has_lots ||
                          a.price_range.min === 0 ||
                          a.price_range.max === 0 ||
                          a.size_range.min === 0 ||
                          a.size_range.max === 0;
      const bIncomplete = !b.has_lots ||
                          b.price_range.min === 0 ||
                          b.price_range.max === 0 ||
                          b.size_range.min === 0 ||
                          b.size_range.max === 0;

      // Complete tenders come before incomplete ones
      if (aIncomplete && !bIncomplete) return 1;
      if (!aIncomplete && bIncomplete) return -1;
      return 0;
    });

    setFilteredTenders(sorted);
  }, [selectedCityCode, processedTenders]);

  // Aggregate tenders by city for map
  const cityAggregates = useMemo(() => {
    return aggregateTendersByCity(processedTenders);
  }, [processedTenders]);

  // Get city code of hovered tender
  const hoveredCityCode = useMemo(() => {
    if (!hoveredTenderId) return null;
    const hoveredTender = processedTenders.find(t => t.michraz_id === hoveredTenderId);
    return hoveredTender?.city_code || null;
  }, [hoveredTenderId, processedTenders]);

  // Handle city click from map
  const handleCityClick = (cityCode: number) => {
    // Check if this city has only one tender
    const cityData = cityAggregates.get(cityCode);
    if (cityData && cityData.tender_count === 1) {
      // Open modal for the single tender
      setSelectedTender(cityData.tenders[0]);
    } else {
      // Filter by city
      setSelectedCityCode((prev) => (prev === cityCode ? null : cityCode));
    }
  };

  // Handle tender click
  const handleTenderClick = (tender: ProcessedTender) => {
    setSelectedTender(tender);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSelectedCityCode(null);
  };

  // Get raw tender for selected tender
  const selectedRawTender = selectedTender
    ? rawTenders.find(rt => rt.michraz_id === selectedTender.michraz_id) || null
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-terracotta-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">טוען מכרזים...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card-container p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">שגיאה בטעינת מכרזים</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Desktop Layout (side by side) */}
      <div className="hidden md:flex h-screen">
        {/* Map - 2/3 width */}
        <div className="w-2/3 relative">
          <TenderMap
            cityAggregates={cityAggregates}
            hoveredCityCode={hoveredCityCode}
            selectedCityCode={selectedCityCode}
            onCityClick={handleCityClick}
          />
        </div>

        {/* List - 1/3 width */}
        <div className="w-1/3 h-full border-r border-gray-200">
          <TenderList
            tenders={filteredTenders}
            selectedCityCode={selectedCityCode}
            hoveredTenderId={hoveredTenderId}
            onTenderHover={setHoveredTenderId}
            onTenderClick={handleTenderClick}
            onClearFilters={handleClearFilters}
          />
        </div>
      </div>

      {/* Mobile Layout (stacked vertically) */}
      <div className="md:hidden flex flex-col min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 text-right">
          <h1 className="text-2xl font-bold text-gray-900">מכרזי הקרקעות של רמ״י</h1>
        </div>

        {/* Map - fixed height */}
        <div className="h-96 relative">
          <TenderMap
            cityAggregates={cityAggregates}
            hoveredCityCode={hoveredCityCode}
            selectedCityCode={selectedCityCode}
            onCityClick={handleCityClick}
          />
        </div>

        {/* List - scrollable */}
        <div className="flex-1 overflow-y-auto">
          <TenderList
            tenders={filteredTenders}
            selectedCityCode={selectedCityCode}
            hoveredTenderId={hoveredTenderId}
            onTenderHover={setHoveredTenderId}
            onTenderClick={handleTenderClick}
            onClearFilters={handleClearFilters}
          />
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div
          className="absolute top-20 right-20 w-64 h-64 bg-terracotta-200 organic-blob opacity-10 animate-float"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="absolute bottom-32 left-20 w-80 h-80 bg-sage-200 organic-blob opacity-10 animate-float"
          style={{ animationDelay: '2s' }}
        />
      </div>

      {/* Tender Details Modal */}
      {selectedTender && (
        <TenderModal
          tender={selectedTender}
          rawTender={selectedRawTender}
          onClose={() => setSelectedTender(null)}
        />
      )}
    </div>
  );
}
