// Reservation Calendar Component - Compact visual calendar with inline reservations

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, addMonths, subMonths, getDay, isWithinInterval, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/modules/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/shared/components/ui/dialog';
import { Badge } from '@/modules/shared/components/ui/badge';
import { ReservationWithDetails, RESERVATION_STATUS_LABELS, RESERVATION_STATUS_VARIANTS } from '../../types/reservations.types';
import { ReservationStatus } from '@/modules/shared/types/api.types';

interface ReservationCalendarProps {
  reservations: ReservationWithDetails[];
  onReservationClick?: (reservation: ReservationWithDetails) => void;
}


export function ReservationCalendar({ reservations, onReservationClick }: ReservationCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedReservations, setSelectedReservations] = useState<ReservationWithDetails[] | null>(null);

  // Get month boundaries
  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start, end });

  // Padding for start of month
  const startDay = getDay(start);
  const padding = Array.from({ length: startDay === 0 ? 6 : startDay - 1 });

  const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  // Get reservations for a specific day (overlapping with that day)
  const getReservationsForDay = (day: Date) => {
    return reservations.filter((r) => {
      if (r.status === ReservationStatus.CANCELLED) return false;

      const checkIn = parseISO(r.checkInDate);
      const checkOut = parseISO(r.checkOutDate);

      return isWithinInterval(day, { start: checkIn, end: checkOut });
    });
  };

  // Color mapping for reservation statuses
  const statusColors: Record<ReservationStatus, string> = {
    [ReservationStatus.PENDING]: "bg-yellow-500",
    [ReservationStatus.CONFIRMED]: "bg-green-500",
    [ReservationStatus.COMPLETED]: "bg-blue-500",
    [ReservationStatus.CANCELLED]: "bg-red-500",
  };

  // Navigation
  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Handle clicking on a day's reservations
  const handleDayClick = (dayReservations: ReservationWithDetails[]) => {
    if (dayReservations.length > 0) {
      setSelectedReservations(dayReservations);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={previousMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: es })}
        </h3>
        <Button variant="outline" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
        {/* Day headers */}
        {dayNames.map((d) => (
          <div
            key={d}
            className="bg-muted p-2 text-center text-xs font-medium text-muted-foreground"
          >
            {d}
          </div>
        ))}

        {/* Padding days before month starts */}
        {padding.map((_, i) => (
          <div key={`p${i}`} className="bg-background p-2 min-h-[100px]" />
        ))}

        {/* Calendar days */}
        {days.map((day) => {
          const dayReservations = getReservationsForDay(day);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={day.toISOString()}
              className={`bg-background p-1.5 min-h-[100px] border-t ${
                dayReservations.length > 0 ? 'cursor-pointer hover:bg-muted/50' : ''
              }`}
              onClick={() => handleDayClick(dayReservations)}
            >
              {/* Day number */}
              <span
                className={`text-xs font-medium ${
                  isCurrentDay ? 'text-primary font-bold' : ''
                }`}
              >
                {format(day, "d")}
              </span>

              {/* Reservations list */}
              <div className="mt-1 space-y-0.5">
                {dayReservations.slice(0, 3).map((reservation) => {
                  const roomNumber = reservation.room?.number || `#${reservation.roomId}`;
                  const guestName = `${reservation.mainGuest.firstName} ${reservation.mainGuest.lastName}`;

                  return (
                    <div
                      key={reservation.id}
                      className={`text-[10px] text-white px-1 py-0.5 rounded truncate ${
                        statusColors[reservation.status] ?? "bg-muted"
                      }`}
                      title={`${guestName} - ${roomNumber}`}
                    >
                      {reservation.mainGuest.firstName} · {roomNumber}
                    </div>
                  );
                })}

                {/* Show count if more than 3 */}
                {dayReservations.length > 3 && (
                  <span className="text-[10px] text-muted-foreground">
                    +{dayReservations.length - 3} más
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-yellow-500"></div>
          <span>Pendiente</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500"></div>
          <span>Confirmada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500"></div>
          <span>Completada</span>
        </div>
      </div>

      {/* Day Details Modal */}
      {selectedReservations && (
        <Dialog open={!!selectedReservations} onOpenChange={() => setSelectedReservations(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Reservas del día - {selectedReservations.length} {selectedReservations.length === 1 ? 'reserva' : 'reservas'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3 mt-4">
              {selectedReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => {
                    setSelectedReservations(null);
                    onReservationClick?.(reservation);
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      {/* Guest and status */}
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {reservation.mainGuest.firstName} {reservation.mainGuest.lastName}
                        </span>
                        <Badge variant={RESERVATION_STATUS_VARIANTS[reservation.status]} className="text-xs">
                          {RESERVATION_STATUS_LABELS[reservation.status]}
                        </Badge>
                      </div>

                      {/* Room info */}
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">
                          Habitación {reservation.room?.number || `#${reservation.roomId}`}
                        </span>
                        {reservation.room?.name && ` - ${reservation.room.name}`}
                      </div>

                      {/* Dates */}
                      <div className="text-sm text-muted-foreground">
                        📅 {format(parseISO(reservation.checkInDate), 'dd/MM/yyyy')} → {format(parseISO(reservation.checkOutDate), 'dd/MM/yyyy')}
                      </div>

                      {/* Contact */}
                      <div className="text-xs text-muted-foreground">
                        📧 {reservation.mainGuest.email}
                        {reservation.mainGuest.phone && ` · 📞 ${reservation.mainGuest.phone}`}
                      </div>

                      {/* Special requests */}
                      {reservation.notes && (
                        <div className="text-xs text-muted-foreground italic border-l-2 border-border pl-2">
                          {reservation.notes}
                        </div>
                      )}
                    </div>

                    {/* Price and guests */}
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Total</div>
                      <div className="font-semibold text-primary">${(reservation.totalPrice || 0).toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        👥 {reservation.baseGuestsCount + reservation.extraGuestsCount} {(reservation.baseGuestsCount + reservation.extraGuestsCount) === 1 ? 'huésped' : 'huéspedes'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

