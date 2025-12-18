// User data types
export interface UserData {
  idNumber: string;
  birthDate: string;
  age: number;
  sex: 'male' | 'female';
  maritalStatus: 'single' | 'married';
  isReservist: boolean;
  isCombatUnit: boolean;
}

// Tender data types (for future implementation)
export interface PriceRange {
  min: number;
  max: number;
}

export interface SizeRange {
  min: number;
  max: number;
}

export interface Tender {
  id: string;
  location: string;
  city?: string;
  neighborhood?: string;
  numberOfLots: number;
  sizeRange: SizeRange; // in square meters
  priceRange: PriceRange; // base prices
  developmentCostRange: PriceRange;
  deadlineDate: string;
  tenderUrl: string;
  description?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Price calculation helpers (for future implementation)
export interface PriceAdjustment {
  basePrice: number;
  maritalStatusDiscount?: number;
  reservistDiscount?: number;
  combatUnitDiscount?: number;
  finalPrice: number;
}

export type TenderFilterOptions = {
  minPrice?: number;
  maxPrice?: number;
  minSize?: number;
  maxSize?: number;
  locations?: string[];
  sortBy?: 'price' | 'size' | 'deadline' | 'location';
  sortOrder?: 'asc' | 'desc';
};
