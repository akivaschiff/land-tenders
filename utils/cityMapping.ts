// Import full locations data from israel-geolocation package
import locationsData from '@/data/locations.json';

interface Location {
  id: string;
  name: string;
  nameEn: string;
  lat: number;
  lon: number;
}

const locations = locationsData as Location[];

/**
 * Get location by ID
 * @param kodYeshuv - Israeli settlement code
 * @returns Location object or undefined if not found
 */
function getById(kodYeshuv: number): Location | undefined {
  const idStr = String(kodYeshuv);
  return locations.find(loc => loc.id === idStr);
}

/**
 * Get city name in English from settlement code
 * @param kodYeshuv - Israeli settlement code
 * @returns City name in English or 'Unknown Location' if not found
 */
export function getCityName(kodYeshuv: number): string {
  const location = getById(kodYeshuv);

  if (!location) {
    return 'מיקום לא ידוע';
  }

  // Use Hebrew name, fallback to English if Hebrew is not available
  return location.name || location.nameEn || 'מיקום לא ידוע';
}

/**
 * Get city coordinates from settlement code
 * @param kodYeshuv - Israeli settlement code
 * @returns Coordinates { lat, lng } or null if not found
 */
export function getCityCoordinates(kodYeshuv: number): { lat: number; lng: number } | null {
  const location = getById(kodYeshuv);

  if (!location || !location.lat || !location.lon) {
    return null;
  }

  // Validate that coordinates are actual numbers and not NaN
  if (isNaN(location.lat) || isNaN(location.lon)) {
    return null;
  }

  // Validate that coordinates are within reasonable bounds for Israel
  // Israel's approximate bounds: lat 29-34, lng 34-36
  if (location.lat < 29 || location.lat > 34 || location.lon < 34 || location.lon > 36) {
    return null;
  }

  return {
    lat: location.lat,
    lng: location.lon,
  };
}

/**
 * Get full city data from settlement code
 * @param kodYeshuv - Israeli settlement code
 * @returns Location data or null if not found
 */
export function getCityData(kodYeshuv: number): Location | null {
  const location = getById(kodYeshuv);

  if (!location) {
    return null;
  }

  return location;
}
