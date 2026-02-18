/**
 * Safely parse roomAmenities or bathroomAmenities from various formats
 * Handles cases where the data might be:
 * - Already an array
 * - A JSON string that needs parsing
 * - null or undefined
 * - Invalid JSON
 */
export function parseAmenities(amenities: string[] | string | null | undefined): string[] {
  if (Array.isArray(amenities)) {
    return amenities;
  }

  if (typeof amenities === 'string' && amenities.trim()) {
    try {
      const parsed = JSON.parse(amenities);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse amenities:', e);
    }
  }

  return [];
}

/**
 * Safely parse photo arrays (mainPhoto or additionalPhotos) from various formats
 * Handles cases where the data might be:
 * - Already an array
 * - A JSON string that needs parsing
 * - null or undefined
 * - Invalid JSON
 */
export function parsePhotos(photos: string[] | string | null | undefined): string[] {
  if (Array.isArray(photos)) {
    return photos;
  }

  if (typeof photos === 'string' && photos.trim()) {
    try {
      const parsed = JSON.parse(photos);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse photos:', e);
    }
  }

  return [];
}
