import { parseCommaSeparatedNumber } from './formatters';
import { getCityName, getCityCoordinates } from './cityMapping';

// Raw tender structure from JSON
export interface RawTender {
  michraz_id: number;
  michraz_name: string;
  kod_yeshuv: number;
  shchuna: string;
  plots: RawPlot[];
}

export interface RawPlot {
  lot_number: string;
  lot_size: string;
  full_value: string;
  value_reservist_no_house: string;
  value_reservist_with_house: string;
  value_combat_no_house: string;
  total_development: string;
}

// Processed tender structure
export interface ProcessedTender {
  michraz_id: number;
  michraz_name: string;
  city_code: number;
  city_name: string;
  neighborhood: string;
  lot_count: number;
  size_range: { min: number; max: number };
  price_range: { min: number; max: number };
  has_lots: boolean;
  coordinates: { lat: number; lng: number } | null;
}

// Aggregated city data for map markers
export interface CityAggregate {
  city_code: number;
  city_name: string;
  coordinates: { lat: number; lng: number };
  tender_count: number;
  total_lots: number;
  tenders: ProcessedTender[];
}

/**
 * Process raw tender data into structured format
 * @param rawTenders - Array of raw tenders from JSON
 * @returns Array of processed tenders
 */
export function processTenders(rawTenders: RawTender[]): ProcessedTender[] {
  return rawTenders.map((tender) => {
    const hasLots = tender.plots && tender.plots.length > 0;

    // Calculate size range
    let sizeRange = { min: 0, max: 0 };
    if (hasLots) {
      const sizes = tender.plots
        .map((plot) => parseCommaSeparatedNumber(plot.lot_size))
        .filter((size) => size > 0);

      if (sizes.length > 0) {
        sizeRange = {
          min: Math.min(...sizes),
          max: Math.max(...sizes),
        };
      }
    }

    // Calculate price range
    let priceRange = { min: 0, max: 0 };
    if (hasLots) {
      const prices = tender.plots
        .map((plot) => parseCommaSeparatedNumber(plot.full_value))
        .filter((price) => price > 0);

      if (prices.length > 0) {
        priceRange = {
          min: Math.min(...prices),
          max: Math.max(...prices),
        };
      }
    }

    return {
      michraz_id: tender.michraz_id,
      michraz_name: tender.michraz_name,
      city_code: tender.kod_yeshuv,
      city_name: getCityName(tender.kod_yeshuv),
      neighborhood: tender.shchuna || '',
      lot_count: hasLots ? tender.plots.length : 0,
      size_range: sizeRange,
      price_range: priceRange,
      has_lots: hasLots,
      coordinates: getCityCoordinates(tender.kod_yeshuv),
    };
  });
}

/**
 * Aggregate tenders by city for map markers
 * @param tenders - Array of processed tenders
 * @returns Map of city codes to aggregated data
 */
export function aggregateTendersByCity(tenders: ProcessedTender[]): Map<number, CityAggregate> {
  const cityMap = new Map<number, CityAggregate>();

  for (const tender of tenders) {
    // Skip tenders without coordinates or with invalid coordinates
    if (!tender.coordinates) {
      continue;
    }

    // Double-check for NaN coordinates
    if (isNaN(tender.coordinates.lat) || isNaN(tender.coordinates.lng)) {
      continue;
    }

    if (!cityMap.has(tender.city_code)) {
      cityMap.set(tender.city_code, {
        city_code: tender.city_code,
        city_name: tender.city_name,
        coordinates: tender.coordinates,
        tender_count: 0,
        total_lots: 0,
        tenders: [],
      });
    }

    const cityData = cityMap.get(tender.city_code)!;
    cityData.tender_count += 1;
    cityData.total_lots += tender.lot_count;
    cityData.tenders.push(tender);
  }

  return cityMap;
}

/**
 * Filter tenders based on criteria
 * @param tenders - Array of processed tenders
 * @param filters - Filter criteria
 * @returns Filtered array of tenders
 */
export function filterTenders(
  tenders: ProcessedTender[],
  filters: {
    cityCode?: number | null;
    priceMin?: number;
    priceMax?: number;
    sizeMin?: number;
    sizeMax?: number;
  }
): ProcessedTender[] {
  return tenders.filter((tender) => {
    // City filter
    if (filters.cityCode !== undefined && filters.cityCode !== null) {
      if (tender.city_code !== filters.cityCode) {
        return false;
      }
    }

    // Skip tenders without lots for price/size filtering
    if (!tender.has_lots) {
      return true; // Still show "Coming Soon" tenders
    }

    // Price filter
    if (filters.priceMin !== undefined) {
      if (tender.price_range.max < filters.priceMin) {
        return false;
      }
    }

    if (filters.priceMax !== undefined) {
      if (tender.price_range.min > filters.priceMax) {
        return false;
      }
    }

    // Size filter
    if (filters.sizeMin !== undefined) {
      if (tender.size_range.max < filters.sizeMin) {
        return false;
      }
    }

    if (filters.sizeMax !== undefined) {
      if (tender.size_range.min > filters.sizeMax) {
        return false;
      }
    }

    return true;
  });
}
