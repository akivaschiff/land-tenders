/**
 * Format a number with commas as thousands separators
 * @param num - Number to format
 * @returns Formatted string with commas
 */
export function formatNumberWithCommas(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Format a price range in shortened format (e.g., "₪450k-₪770k")
 * @param min - Minimum price
 * @param max - Maximum price
 * @returns Formatted price range string
 */
export function formatPriceRange(min: number, max: number): string {
  const formatPrice = (price: number): string => {
    if (price >= 1000000) {
      // Format millions
      const millions = price / 1000000;
      return `₪${millions.toFixed(millions >= 10 ? 1 : 2)}M`;
    } else if (price >= 1000) {
      // Format thousands
      const thousands = price / 1000;
      return `₪${thousands.toFixed(thousands >= 100 ? 0 : 0)}k`;
    } else {
      return `₪${price}`;
    }
  };

  return `${formatPrice(min)}-${formatPrice(max)}`;
}

/**
 * Format a size range in square meters
 * @param min - Minimum size
 * @param max - Maximum size
 * @returns Formatted size range string
 */
export function formatSizeRange(min: number, max: number): string {
  return `${min}-${max} מ"ר`;
}

/**
 * Parse a comma-separated number string to a number
 * @param str - String like "1,061,000"
 * @returns Parsed number
 */
export function parseCommaSeparatedNumber(str: string): number {
  if (!str || typeof str !== 'string') {
    return 0;
  }

  // Remove all commas and parse
  const cleaned = str.replace(/,/g, '');
  const parsed = parseFloat(cleaned);

  return isNaN(parsed) ? 0 : parsed;
}
