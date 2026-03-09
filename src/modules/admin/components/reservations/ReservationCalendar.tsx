// Reservation Calendar Component - Gantt-style: rooms as rows, days as columns

import { useState, useRef, useEffect } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  addMonths,
  subMonths,
  addDays,
  subDays,
  parseISO,
  isBefore,
  isAfter,
  isSameDay,
  startOfDay,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/modules/shared/components/ui/button';
import { Badge } from '@/modules/shared/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/modules/shared/components/ui/tooltip';
import {
  ReservationWithDetails,
  RESERVATION_STATUS_LABELS,
  RESERVATION_STATUS_VARIANTS,
} from '../../types/reservations.types';
import { ReservationStatus } from '@/modules/shared/types/api.types';

interface ReservationCalendarProps {
  reservations: ReservationWithDetails[];
  onReservationClick?: (reservation: ReservationWithDetails) => void;
  occupiedDates?: string[];
}

type ViewMode = '7d' | '14d' | 'month';

// Status color scheme (Tailwind classes for the reservation bars)
const STATUS_BAR_COLORS: Record<ReservationStatus, string> = {
  [ReservationStatus.PENDING]: 'bg-yellow-400 border-yellow-500 text-yellow-900',
  [ReservationStatus.CONFIRMED]: 'bg-green-400 border-green-500 text-green-900',
  [ReservationStatus.FINISHED]: 'bg-blue-400 border-blue-500 text-blue-900',
  [ReservationStatus.CANCELLED]: 'bg-red-300 border-red-400 text-red-900 opacity-60',
};

const ROW_HEIGHT = 68;
const MIN_DAY_WIDTH = 40;
const LABEL_WIDTH = 160;

const VIEW_OPTIONS: { value: ViewMode; label: string }[] = [
  { value: '7d', label: '7 días' },
  { value: '14d', label: '14 días' },
  { value: 'month', label: 'Mes' },
];

export function ReservationCalendar({
  reservations,
  onReservationClick,
}: ReservationCalendarProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  // anchor: first day of the visible window
  const [anchorDate, setAnchorDate] = useState<Date>(startOfMonth(new Date()));
  const scrollRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Measure scrollable container width and update on resize
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    setContainerWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // Compute the visible day range based on mode
  const rangeStart =
    viewMode === 'month' ? startOfMonth(anchorDate) : startOfDay(anchorDate);
  const rangeEnd =
    viewMode === 'month'
      ? endOfMonth(anchorDate)
      : viewMode === '14d'
      ? addDays(anchorDate, 13)
      : addDays(anchorDate, 6);

  const days = eachDayOfInterval({ start: rangeStart, end: rangeEnd });

  // Day column width: fill available space, never narrower than MIN_DAY_WIDTH
  const dayWidth =
    containerWidth > 0 && days.length > 0
      ? Math.max(MIN_DAY_WIDTH, containerWidth / days.length)
      : MIN_DAY_WIDTH;

  // Navigation step depends on view mode
  const goNext = () => {
    if (viewMode === 'month') setAnchorDate((d) => startOfMonth(addMonths(d, 1)));
    else if (viewMode === '14d') setAnchorDate((d) => addDays(d, 14));
    else setAnchorDate((d) => addDays(d, 7));
  };
  const goPrev = () => {
    if (viewMode === 'month') setAnchorDate((d) => startOfMonth(subMonths(d, 1)));
    else if (viewMode === '14d') setAnchorDate((d) => subDays(d, 14));
    else setAnchorDate((d) => subDays(d, 7));
  };
  const goToToday = () => {
    const today = new Date();
    setAnchorDate(viewMode === 'month' ? startOfMonth(today) : startOfDay(today));
  };

  // Label for the header
  const rangeLabel =
    viewMode === 'month'
      ? format(rangeStart, 'MMMM yyyy', { locale: es })
      : `${format(rangeStart, 'd MMM', { locale: es })} – ${format(rangeEnd, 'd MMM yyyy', { locale: es })}`;

  // When view mode changes, re-anchor to today
  const handleViewModeChange = (mode: ViewMode) => {
    const today = new Date();
    setAnchorDate(mode === 'month' ? startOfMonth(today) : startOfDay(today));
    setViewMode(mode);
  };

  // Collect unique rooms present in any reservation, sorted by room number
  const roomMap = new Map<number, { id: number; number: string; name: string }>();
  reservations.forEach((r) => {
    if (!roomMap.has(r.roomId)) {
      roomMap.set(r.roomId, {
        id: r.roomId,
        number: r.room?.number ?? `#${r.roomId}`,
        name: r.room?.name ?? '',
      });
    }
  });
  const rooms = Array.from(roomMap.values()).sort((a, b) =>
    a.number.localeCompare(b.number, undefined, { numeric: true })
  );

  // Scroll so today is centred whenever the range or dayWidth changes
  useEffect(() => {
    if (!scrollRef.current) return;
    const todayIndex = days.findIndex((d) => isToday(d));
    if (todayIndex !== -1) {
      const offset =
        todayIndex * dayWidth - (scrollRef.current.clientWidth / 2 - dayWidth / 2);
      scrollRef.current.scrollLeft = Math.max(0, offset);
    } else {
      scrollRef.current.scrollLeft = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchorDate, viewMode, dayWidth]);

  // Non-cancelled reservations for a room that overlap the visible range
  const getReservationsForRoom = (roomId: number) =>
    reservations.filter((r) => {
      if (r.roomId !== roomId) return false;
      if (r.status === ReservationStatus.CANCELLED) return false;
      const checkIn = parseISO(r.checkInDate);
      const checkOut = parseISO(r.checkOutDate);
      return !isAfter(checkIn, rangeEnd) && !isBefore(checkOut, rangeStart);
    });

  // Column indices (clamped to this range) for a reservation bar
  const getBarBounds = (r: ReservationWithDetails) => {
    const checkIn = parseISO(r.checkInDate);
    const checkOut = parseISO(r.checkOutDate);
    const visibleStart = isBefore(checkIn, rangeStart) ? rangeStart : checkIn;
    const visibleEnd = isAfter(checkOut, rangeEnd) ? rangeEnd : checkOut;
    const startIdx = days.findIndex((d) => isSameDay(d, visibleStart));
    const endIdx = days.findIndex((d) => isSameDay(d, visibleEnd));
    return {
      colStart: startIdx === -1 ? 0 : startIdx,
      colEnd: endIdx === -1 ? days.length - 1 : endIdx,
    };
  };

  const totalGridWidth = days.length * dayWidth;

  // Extract HH:mm from an ISO string; fall back to a default if the time part is 00:00
  const extractTime = (isoString: string, fallback: string): string => {
    const d = parseISO(isoString);
    const h = d.getHours();
    const m = d.getMinutes();
    if (h === 0 && m === 0) return fallback;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={goPrev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold capitalize min-w-[200px] text-center">
              {rangeLabel}
            </h3>
            <Button variant="outline" size="icon" onClick={goNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {/* View mode toggle */}
            <div className="flex rounded-md border overflow-hidden">
              {VIEW_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleViewModeChange(opt.value)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors border-r last:border-r-0 ${
                    viewMode === opt.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Hoy
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          {(
            [
              ReservationStatus.PENDING,
              ReservationStatus.CONFIRMED,
              ReservationStatus.FINISHED,
            ] as ReservationStatus[]
          ).map((status) => (
            <div key={status} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded border ${STATUS_BAR_COLORS[status]}`} />
              <span>{RESERVATION_STATUS_LABELS[status]}</span>
            </div>
          ))}
        </div>

        {/* Gantt grid */}
        <div className="border rounded-lg overflow-hidden bg-background">
          {rooms.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No hay reservas activas en este período.
            </div>
          ) : (
            <div className="flex">
              {/* Fixed room-label column */}
              <div
                className="flex-shrink-0 border-r bg-muted/50"
                style={{ width: LABEL_WIDTH }}
              >
                {/* Corner cell */}
                <div
                  className="border-b bg-muted flex items-center px-3"
                  style={{ height: ROW_HEIGHT }}
                >
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Habitación
                  </span>
                </div>

                {rooms.map((room, i) => (
                  <div
                    key={room.id}
                    className={`flex flex-col justify-center px-3 border-b ${
                      i % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                    }`}
                    style={{ height: ROW_HEIGHT }}
                  >
                    <span className="text-sm font-medium leading-tight truncate">
                      Hab. {room.number}
                    </span>
                    {room.name && (
                      <span className="text-[11px] text-muted-foreground truncate leading-tight">
                        {room.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Scrollable day columns */}
              <div
                ref={scrollRef}
                className="overflow-x-auto flex-1"
                style={{ scrollbarWidth: 'thin' }}
              >
                <div style={{ width: totalGridWidth, minWidth: totalGridWidth }}>
                  {/* Day header row */}
                  <div className="flex border-b bg-muted" style={{ height: ROW_HEIGHT }}>
                    {days.map((day) => {
                      const today = isToday(day);
                      const isWeekend = [0, 6].includes(day.getDay());
                      return (
                        <div
                          key={day.toISOString()}
                          className={`flex-shrink-0 flex flex-col items-center justify-center border-r text-center select-none ${
                            today
                              ? 'bg-primary/10 text-primary font-bold'
                              : isWeekend
                              ? 'bg-muted/60 text-muted-foreground'
                              : 'text-muted-foreground'
                          }`}
                          style={{ width: dayWidth }}
                        >
                          <span className="text-[10px] capitalize leading-none">
                            {format(day, 'EEE', { locale: es }).slice(0, 2)}
                          </span>
                          <span className="text-xs font-semibold leading-tight">
                            {format(day, 'd')}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* One row per room */}
                  {rooms.map((room, i) => {
                    const roomReservations = getReservationsForRoom(room.id);
                    return (
                      <div
                        key={room.id}
                        className={`relative border-b ${
                          i % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                        }`}
                        style={{ height: ROW_HEIGHT }}
                      >
                        {/* Grid lines + weekend/today shading */}
                        <div className="absolute inset-0 flex pointer-events-none">
                          {days.map((day) => {
                            const today = isToday(day);
                            const isWeekend = [0, 6].includes(day.getDay());
                            return (
                              <div
                                key={day.toISOString()}
                                className={`flex-shrink-0 h-full border-r ${
                                  today ? 'bg-primary/5' : isWeekend ? 'bg-muted/30' : ''
                                }`}
                                style={{ width: dayWidth }}
                              />
                            );
                          })}
                        </div>

                        {/* Reservation bars */}
                        {roomReservations.map((r) => {
                          const { colStart, colEnd } = getBarBounds(r);
                          const barLeft = colStart * dayWidth + 2;
                          const barWidth = (colEnd - colStart + 1) * dayWidth - 4;
                          const guestName = `${r.mainGuest.firstName} ${r.mainGuest.lastName}`;
                          const nights = colEnd - colStart + 1;
                          const isOneNight = nights === 1;
                          const checkInTime = isOneNight
                            ? extractTime(r.checkInDate, '14:00')
                            : null;
                          const checkOutTime = isOneNight
                            ? extractTime(r.checkOutDate, '11:00')
                            : null;

                          return (
                            <Tooltip key={r.id}>
                              <TooltipTrigger asChild>
                                <button
                                  className={`absolute top-1/2 -translate-y-1/2 rounded border text-[11px] font-medium
                                    cursor-pointer overflow-hidden px-1.5
                                    hover:brightness-95 transition-all ${STATUS_BAR_COLORS[r.status]}`}
                                  style={{
                                    left: barLeft,
                                    width: barWidth,
                                    height: ROW_HEIGHT - 14,
                                  }}
                                  onClick={() => onReservationClick?.(r)}
                                  title={guestName}
                                >
                                  {isOneNight ? (
                                    <div className="flex flex-col justify-center h-full leading-none gap-0.5 min-w-0">
                                      <span className="truncate">
                                        {barWidth > 60
                                          ? `${r.mainGuest.firstName} ${r.mainGuest.lastName.charAt(0)}.`
                                          : `${r.mainGuest.firstName.charAt(0)}.${r.mainGuest.lastName.charAt(0)}.`}
                                      </span>
                                      {barWidth > 72 && (
                                        <span className="truncate opacity-80 text-[10px]">
                                          {checkInTime} → {checkOutTime}
                                        </span>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1 h-full min-w-0">
                                      <span className="truncate">
                                        {r.mainGuest.firstName}{' '}
                                        {r.mainGuest.lastName.charAt(0)}.
                                      </span>
                                      {barWidth > 80 && (
                                        <span className="opacity-70 shrink-0">{nights}n</span>
                                      )}
                                    </div>
                                  )}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-[260px]">
                                <div className="space-y-1 text-xs">
                                  <div className="font-semibold">{guestName}</div>
                                  <div>
                                    Hab. {room.number}
                                    {room.name && ` – ${room.name}`}
                                  </div>
                                  {isOneNight ? (
                                    <div className="space-y-0.5">
                                      <div>
                                        📅 {format(parseISO(r.checkInDate), 'dd/MM/yyyy')} →{' '}
                                        {format(parseISO(r.checkOutDate), 'dd/MM/yyyy')}
                                      </div>
                                      <div className="text-muted-foreground">
                                        🕐 Entrada: <span className="font-medium text-foreground">{checkInTime}</span>
                                        {'  '}·{'  '}
                                        Salida: <span className="font-medium text-foreground">{checkOutTime}</span>
                                      </div>
                                    </div>
                                  ) : (
                                    <div>
                                      {format(parseISO(r.checkInDate), 'dd/MM/yyyy')} →{' '}
                                      {format(parseISO(r.checkOutDate), 'dd/MM/yyyy')}
                                    </div>
                                  )}
                                  <Badge
                                    variant={RESERVATION_STATUS_VARIANTS[r.status]}
                                    className="text-[10px] px-1 py-0"
                                  >
                                    {RESERVATION_STATUS_LABELS[r.status]}
                                  </Badge>
                                  <div className="font-medium text-primary">
                                    ${(Number(r.totalPrice) || 0).toFixed(2)}
                                  </div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
