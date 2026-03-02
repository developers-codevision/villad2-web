/**
 * Safely parse promotion services from various formats
 * Handles cases where the data might be:
 * - Already an array
 * - A JSON string that needs parsing
 * - A string with escaped quotes
 * - null or undefined
 * - Invalid JSON
 */
export function parseServices(services: string[] | string | null | undefined): string[] {
  if (!services) {
    return [];
  }

  // If it's already an array, filter and return
  if (Array.isArray(services)) {
    return services.filter(s => typeof s === 'string' && s.trim().length > 0);
  }

  // If it's a string, try to parse it
  if (typeof services === 'string' && services.trim()) {
    // Remove leading/trailing whitespace and quotes
    let cleaned = services.trim();

    // Handle escaped quotes
    if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
      cleaned = cleaned.slice(1, -1);
    }

    // Try to parse as JSON
    try {
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        return parsed.filter(s => typeof s === 'string' && s.trim().length > 0);
      }
      // If parsed object is not an array but is an object with array-like structure
      if (typeof parsed === 'object' && parsed !== null) {
        const values = Object.values(parsed).filter((s): s is string => typeof s === 'string' && s.trim().length > 0);
        if (values.length > 0) {
          return values;
        }
      }
    } catch (e) {
      // If JSON parsing fails, return empty array
      console.warn('Failed to parse services:', services, e);
    }
  }

  return [];
}

/**
 * Convert 24h time string to 12h format with AM/PM
 * - "15:00" -> "3:00 PM"
 * - "09:30" -> "9:30 AM"
 * - "12:00" -> "12:00 PM"
 * - "00:00" -> "12:00 AM"
 * Returns original string for unknown formats
 */
export function formatTimeToAmPm(time?: string | null): string {
  if (!time) return '';

  // Accept formats like "HH:mm" or "HH:mm:ss" or "H:mm"
  const match = time.trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!match) return time; // return as-is if we can't parse

  let hour = parseInt(match[1], 10);
  const minute = match[2];
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;

  return `${hour}:${minute} ${ampm}`;
}
