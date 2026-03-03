// Shared Availability Hook - Business logic for availability management

import { useState, useCallback, useEffect } from 'react';
import { parseISO, addDays, setHours, setMinutes, isValid, format, startOfDay } from 'date-fns';
import { reservationsService } from '@/modules/shared/services';
import type { OccupiedDay, OccupiedRange } from '@/modules/shared/types/api.types';

/**
 * Night interval definition used by the booking calendar
 * Night for a date D starts at 16:00 on D and ends at 12:00 on D+1
 */
const NIGHT_START_HOUR = 16; // 16:00
const NIGHT_END_HOUR = 12; // 12:00 next day

function parseMaybeISO(value?: string | null): Date | null {
  if (!value) return null; // guard against undefined/null/empty
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

// Type guard for OccupiedRange-like objects
function isOccupiedRange(obj: unknown): obj is { start: string; end: string } {
  if (!obj || typeof obj !== 'object') return false;
  const r = obj as Record<string, unknown>;
  return typeof r['start'] === 'string' && typeof r['end'] === 'string';
}

// Type guard for OccupiedDay-like objects
function isOccupiedDay(obj: unknown): obj is { date: string; occupiedRanges?: unknown[] } {
  if (!obj || typeof obj !== 'object') return false;
  const r = obj as Record<string, unknown>;
  return typeof r['date'] === 'string' && (r['occupiedRanges'] === undefined || Array.isArray(r['occupiedRanges']));
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

    if (!Array.isArray(days)) return [];

    for (const dayEntry of days) {
      const dayDate = dayEntry.date; // YYYY-MM-DD
      if (!dayDate || typeof dayDate !== 'string') continue;
      // Candidate night starts at dayDate 16:00 and ends at dayDate+1 12:00
      // If dayDate is simple YYYY-MM-DD treat it as local midnight to avoid parseISO UTC shift
      let dayStart: Date | null = null;
      if (/^\d{4}-\d{2}-\d{2}$/.test(dayDate)) {
        // Construct as local midnight
        const localMidnight = new Date(`${dayDate}T00:00:00`);
        dayStart = isValid(localMidnight) ? localMidnight : null;
      } else {
        dayStart = parseMaybeISO(dayDate);
      }
      if (!dayStart || !isValid(dayStart)) continue;

      const nightStart = setMinutes(setHours(dayStart, NIGHT_START_HOUR), 0);
      const nightEnd = setMinutes(setHours(addDays(dayStart, 1), NIGHT_END_HOUR), 0);

      const occupiedRanges = Array.isArray(dayEntry.occupiedRanges) ? dayEntry.occupiedRanges : [];
      for (const occ of occupiedRanges) {
        // Defensive: skip null/undefined entries or entries without start/end
        if (!occ || (occ.start === undefined && occ.end === undefined)) continue;
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
          const startStr = typeof occ.start === 'string' ? occ.start : '';
          const endStr = typeof occ.end === 'string' ? occ.end : '';
          const [sh, sm] = startStr.split(':').map(Number);
          const [eh, em] = endStr.split(':').map(Number);
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
          occupiedSet.add(format(startOfDay(dayStart), 'yyyy-MM-dd'));
          break; // this night is occupied; no need to check other ranges for this night
        }
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.debug('[useAvailability] computed occupied nights from hours:', Array.from(occupiedSet.values()));
    }

    return Array.from(occupiedSet.values());
  };

  /**
   * Compute occupied nights from a flat list of start/end ISO ranges (used for grouped API responses)
   */
  const computeOccupiedNightsFromRanges = (ranges: { start: string; end: string }[]) => {
    const occupiedSet = new Set<string>();

    if (!Array.isArray(ranges)) return [];
    for (const r of ranges) {
      if (!r || typeof r.start !== 'string' || typeof r.end !== 'string') continue;
      const start = parseMaybeISO(r.start);
      const end = parseMaybeISO(r.end);
      if (!start || !end) continue;

      // We'll check candidate nights from (start date - 1) to end date
      let current = startOfDay(addDays(start, -1));
      const endDay = startOfDay(end);

      // Safety: limit iteration to 365 days to avoid infinite loops on bad data
      let iter = 0;
      while (current <= endDay && iter < 366) {
        const nightStart = setMinutes(setHours(current, NIGHT_START_HOUR), 0);
        const nightEnd = setMinutes(setHours(addDays(current, 1), NIGHT_END_HOUR), 0);

        if (rangeOverlaps(start, end, nightStart, nightEnd)) {
          // If the night interval crosses midnight (night start hour is after night end hour)
          // and the night we detected actually *starts* before the reservation's start day,
          // map that occupied night to the reservation start day so we mark the day the
          // reservation begins (as requested). Otherwise, keep the night start day.
          const nightStartDay = startOfDay(current);
          const reservationStartDay = startOfDay(start);
          if (NIGHT_START_HOUR > NIGHT_END_HOUR && nightStartDay < reservationStartDay) {
            occupiedSet.add(format(reservationStartDay, 'yyyy-MM-dd'));
          } else {
            occupiedSet.add(format(nightStartDay, 'yyyy-MM-dd'));
          }
        }

        current = addDays(current, 1);
        iter++;
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.debug('[useAvailability] computed occupied nights from ranges:', Array.from(occupiedSet.values()));
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
        let days = await reservationsService.getOccupiedHoursForRoom(roomId);
        if (process.env.NODE_ENV === 'development') console.debug('[useAvailability] raw days response for roomId=', roomId, days);
        // Coerce array-like responses to array
        if (days && !Array.isArray(days) && typeof days === 'object' && (days as any).length !== undefined) {
          days = Array.from(days as any);
        }
        if (!Array.isArray(days)) days = [];

        // Detect shape: OccupiedDay[] (with date & occupiedRanges) or OccupiedRange[] (flat ranges)
        if (days.length > 0 && isOccupiedRange(days[0])) {
          // API returned flat ranges for the room
          const ranges = days as unknown as { start: string; end: string }[];
          dates = computeOccupiedNightsFromRanges(ranges);
        } else if (days.length > 0 && isOccupiedDay(days[0])) {
          // API returned per-day occupiedRanges
          dates = computeOccupiedNightsFromHours(days as OccupiedDay[]);
        } else {
          // empty or unknown shape
          dates = [];
        }

        // Fallback: if per-room endpoint returned empty but grouped endpoint has data, try to extract ranges for this roomId
        if ((!dates || dates.length === 0)) {
          try {
            const grouped = await reservationsService.getOccupiedHoursGrouped();
            if (process.env.NODE_ENV === 'development') console.debug('[useAvailability] raw grouped response for fallback:', grouped);
            if (grouped && typeof grouped === 'object') {
              const candidate = (grouped as Record<string, unknown>)[String(roomId)];
              if (Array.isArray(candidate) && candidate.length > 0 && isOccupiedRange(candidate[0])) {
                const ranges = candidate as { start: string; end: string }[];
                const fallbackDates = computeOccupiedNightsFromRanges(ranges);
                if (fallbackDates && fallbackDates.length > 0) {
                  dates = fallbackDates;
                  if (process.env.NODE_ENV === 'development') console.debug('[useAvailability] fallback used grouped ranges for roomId', roomId, dates);
                }
              }
            }
          } catch (e) {
            // ignore fallback errors
            if (process.env.NODE_ENV === 'development') console.warn('[useAvailability] fallback grouped fetch failed', e);
          }
        }
      } else {
        let grouped = await reservationsService.getOccupiedHoursGrouped();
        if (process.env.NODE_ENV === 'development') console.debug('[useAvailability] raw grouped response (global):', grouped);
        if (!grouped || typeof grouped !== 'object') grouped = {};
        // grouped is an object mapping roomId -> [{start, end}, ...]
        const allRanges = Object.values(grouped).flat().filter(isOccupiedRange) as {start:string;end:string}[];
        dates = computeOccupiedNightsFromRanges(allRanges);
      }
      if (process.env.NODE_ENV === 'development') {
        console.debug('[useAvailability] loadOccupiedDates result for roomId=', roomId, 'dates=', dates);
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
