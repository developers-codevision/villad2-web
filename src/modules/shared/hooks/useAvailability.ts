// Shared Availability Hook - Business logic for availability management

import { useState, useCallback, useEffect } from 'react';
import { parseISO, addDays, setHours, setMinutes, isValid, format } from 'date-fns';
import { reservationsService } from '@/modules/shared/services';
import type { OccupiedDay } from '@/modules/shared/types/api.types';

/**
 * Night interval definition used by the booking calendar
 * Night for a date D starts at 16:00 on D and ends at 12:00 on D+1
 */
const NIGHT_START_HOUR = 16; // 16:00
const NIGHT_END_HOUR = 12; // 12:00 next day

function parseMaybeISO(value: string): Date | null {
  try {
    const d = parseISO(value);
    return isValid(d) ? d : null;
  } catch (e) {
    return null;
  }
}

function rangeOverlaps(rangeStart: Date, rangeEnd: Date, nightStart: Date, nightEnd: Date) {
  // Overlap if rangeStart < nightEnd && rangeEnd > nightStart
  return rangeStart < nightEnd && rangeEnd > nightStart;
}

export function useAvailability(roomId?: number) {
  const [occupiedDates, setOccupiedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Compute occupied nights for a room from OccupiedDay[]
   * Returns an array of YYYY-MM-DD strings representing nights that should be disabled
   */
  const computeOccupiedNightsFromHours = (days: OccupiedDay[]) => {
    const occupiedSet = new Set<string>();

    for (const dayEntry of days) {
      const dayDate = dayEntry.date; // YYYY-MM-DD
      // Candidate night starts at dayDate 16:00 and ends at dayDate+1 12:00
      const dayStart = parseISO(dayDate);
      if (!isValid(dayStart)) continue;

      const nightStart = setMinutes(setHours(dayStart, NIGHT_START_HOUR), 0);
      const nightEnd = setMinutes(setHours(addDays(dayStart, 1), NIGHT_END_HOUR), 0);

      for (const occ of dayEntry.occupiedRanges ?? []) {
        // Try parsing full ISO timestamps first
        let occStart: Date | null = null;
        let occEnd: Date | null = null;

        // If API returns full ISO timestamps, parse them. Otherwise, if they are time-only like "14:00",
        // assume they belong to the same `dayEntry.date` day.
        const maybeStartISO = parseMaybeISO(occ.start);
        const maybeEndISO = parseMaybeISO(occ.end);

        if (maybeStartISO && maybeEndISO) {
          occStart = maybeStartISO;
          occEnd = maybeEndISO;
        } else {
          // interpret as time strings relative to dayEntry.date
          const [sh, sm] = (occ.start || '').split(':').map(Number);
          const [eh, em] = (occ.end || '').split(':').map(Number);
          if (!Number.isFinite(sh) || !Number.isFinite(eh)) continue;
          occStart = setMinutes(setHours(dayStart, sh), sm || 0);
          occEnd = setMinutes(setHours(dayStart, eh), em || 0);
          // If end is earlier or equal than start, assume it goes to next day
          if (occEnd <= occStart) {
            occEnd = addDays(occEnd, 1);
          }
        }

        if (!occStart || !occEnd) continue;

        if (rangeOverlaps(occStart, occEnd, nightStart, nightEnd)) {
          occupiedSet.add(format(dayStart, 'yyyy-MM-dd'));
          break; // this night is occupied; no need to check other ranges for this night
        }
      }
    }

    return Array.from(occupiedSet.values());
  };

  /**
   * Load occupied dates from API
   */
  const loadOccupiedDates = useCallback(async () => {
    setLoading(true);
    try {
      let dates: string[];
      if (roomId) {
        const days = await reservationsService.getOccupiedHoursForRoom(roomId);
        dates = computeOccupiedNightsFromHours(days);
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
