'use client';

import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import { CityAggregate } from '@/utils/tenderProcessing';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface TenderMapProps {
  cityAggregates: Map<number, CityAggregate>;
  hoveredCityCode: number | null;
  selectedCityCode: number | null;
  onCityClick: (cityCode: number) => void;
}

// Component to handle map zoom/center when selection changes
function MapController({ selectedCityCode, cityAggregates }: { selectedCityCode: number | null; cityAggregates: Map<number, CityAggregate> }) {
  const map = useMap();
  const [hasInitialized, setHasInitialized] = React.useState(false);

  useEffect(() => {
    // Don't do anything if map isn't ready
    if (!map) return;

    // Mark as initialized on first render
    if (!hasInitialized) {
      setHasInitialized(true);
      return; // Don't fly anywhere on initial mount, map is already centered
    }

    if (selectedCityCode !== null && selectedCityCode !== undefined) {
      const cityData = cityAggregates.get(selectedCityCode);
      if (cityData && cityData.coordinates) {
        // Validate coordinates before flying
        const lat = Number(cityData.coordinates.lat);
        const lng = Number(cityData.coordinates.lng);

        if (!isNaN(lat) && !isNaN(lng) && isFinite(lat) && isFinite(lng)) {
          // Use setView instead of flyTo to avoid Leaflet animation bugs
          map.setView([lat, lng], 12);
        }
      }
    } else {
      // Reset to Israel view only after user interaction (not on initial mount)
      map.setView([31.5, 34.9], 8);
    }
  }, [selectedCityCode, cityAggregates, map, hasInitialized]);

  return null;
}

// Create custom marker icon with count badge
function createCustomIcon(count: number, isSelected: boolean, isHovered: boolean): L.DivIcon {
  let baseColor = 'bg-terracotta-500';
  if (isSelected) {
    baseColor = 'bg-terracotta-600';
  } else if (isHovered) {
    baseColor = 'bg-amber-500';
  }

  const scale = isHovered && !isSelected ? 'scale-125' : '';
  const shadow = isHovered && !isSelected ? 'shadow-2xl' : 'shadow-lg';

  return L.divIcon({
    html: `
      <div class="relative transition-all duration-200 ${scale}">
        <div class="w-10 h-10 rounded-full ${baseColor} ${shadow} flex items-center justify-center text-white font-bold border-4 border-white transition-colors duration-200">
          ${count}
        </div>
        <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 ${baseColor} rotate-45 transition-colors duration-200"></div>
      </div>
    `,
    className: 'custom-marker-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 45],
    popupAnchor: [0, -45],
  });
}

export default function TenderMap({
  cityAggregates,
  hoveredCityCode,
  selectedCityCode,
  onCityClick,
}: TenderMapProps) {
  // Convert Map to Array for rendering and filter out invalid coordinates
  const cityArray = useMemo(() => {
    const cities = Array.from(cityAggregates.values()).filter((city) => {
      // Ensure coordinates exist and are valid numbers
      return (
        city.coordinates &&
        !isNaN(city.coordinates.lat) &&
        !isNaN(city.coordinates.lng) &&
        isFinite(city.coordinates.lat) &&
        isFinite(city.coordinates.lng)
      );
    });

    return cities;
  }, [cityAggregates]);

  // Center of Israel
  const israelCenter: LatLngExpression = [31.5, 34.9];

  if (cityArray.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sage-50 to-sky-50">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-terracotta-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">אין נתוני מפה</h3>
          <p className="text-gray-600">לא ניתן להציג מיקומי מכרזים במפה.</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={israelCenter}
      zoom={8}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController selectedCityCode={selectedCityCode} cityAggregates={cityAggregates} />

      {cityArray.map((cityData) => {
        const isSelected = selectedCityCode === cityData.city_code;
        const isHovered = hoveredCityCode === cityData.city_code;

        // Final safety check - ensure we have valid numbers
        const lat = Number(cityData.coordinates.lat);
        const lng = Number(cityData.coordinates.lng);

        // Skip this marker if coordinates are still invalid (should never happen, but safety first)
        if (isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) {
          return null;
        }

        return (
          <Marker
            key={cityData.city_code}
            position={[lat, lng]}
            icon={createCustomIcon(cityData.tender_count, isSelected, isHovered)}
            eventHandlers={{
              click: () => {
                onCityClick(cityData.city_code);
              },
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px] text-right" dir="rtl">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{cityData.city_name}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-terracotta-600">
                      {cityData.tender_count}
                    </span>
                    <span>:מכרזים</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-terracotta-600">
                      {cityData.total_lots}
                    </span>
                    <span>:סה״כ מגרשים</span>
                  </div>
                </div>
                <button
                  onClick={() => onCityClick(cityData.city_code)}
                  className="mt-3 w-full text-xs bg-terracotta-500 hover:bg-terracotta-600 text-white font-medium py-2 px-3 rounded-lg transition-colors"
                >
                  צפה במכרזים
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
