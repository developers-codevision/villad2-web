// Shared Availability Hook - Business logic for availability management

import { useState, useCallback, useEffect } from 'react';
import { reservationsService } from '@/modules/shared/services';

/**
 * Custom hook for managing availability data
 * Handles loading and providing occupied dates
 */
export function useAvailability() {
  const [occupiedDates, setOccupiedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Load occupied dates from API
   */
  const loadOccupiedDates = useCallback(async () => {
    setLoading(true);
    try {
      const dates = await reservationsService.getOccupiedDates();
      setOccupiedDates(dates);
    } catch (error) {
      console.error('Error loading occupied dates:', error);
      setOccupiedDates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load occupied dates on mount
  useEffect(() => {
    loadOccupiedDates();
  }, [loadOccupiedDates]);

  return {
    occupiedDates,
    loading,
    loadOccupiedDates,
  };
}
