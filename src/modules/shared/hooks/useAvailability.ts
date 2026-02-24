// Shared Availability Hook - Business logic for availability management

import { useState, useCallback, useEffect } from 'react';
import { reservationsService } from '@/modules/shared/services';

/**
 * Custom hook for managing availability data
 * Handles loading and providing occupied dates
 * @param roomId - Optional room ID to get occupied dates for a specific room
 */
export function useAvailability(roomId?: number) {
  const [occupiedDates, setOccupiedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Load occupied dates from API
   */
  const loadOccupiedDates = useCallback(async () => {
    setLoading(true);
    try {
      let dates: string[];
      if (roomId) {
        dates = await reservationsService.getOccupiedDatesForRoom(roomId);
      } else {
        const groupedDates = await reservationsService.getOccupiedDatesGrouped();
        // Flatten and get unique dates across all rooms
        dates = Object.values(groupedDates).flat().filter((v, i, a) => a.indexOf(v) === i);
      }
      setOccupiedDates(dates);
    } catch (error) {
      console.error('Error loading occupied dates:', error);
      setOccupiedDates([]);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  // Load occupied dates on mount or when roomId changes
  useEffect(() => {
    loadOccupiedDates();
  }, [loadOccupiedDates]);

  return {
    occupiedDates,
    loading,
    loadOccupiedDates,
  };
}
