// Reservation Detail Sheet - Shows full reservation and guest details in a side panel

import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  BedDouble,
  Clock,
  DollarSign,
  Edit,
  Mail,
  Moon,
  Phone,
  Trash2,
  User,
  Users,
  XCircle,
  CheckCircle,
  StickyNote,
  Sunrise,
  Sunset,
  Car,
} from 'lucide-react';
import { Badge } from '@/modules/shared/components/ui/badge';
import { Button } from '@/modules/shared/components/ui/button';
import { Separator } from '@/modules/shared/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/modules/shared/components/ui/sheet';
import {
  ReservationWithDetails,
  RESERVATION_STATUS_LABELS,
  RESERVATION_STATUS_VARIANTS,
  canConfirmReservation,
  canCancelReservation,
} from '../../types/reservations.types';
import { ReservationStatus, GuestInfo } from '@/modules/shared/types/api.types';
import {ROOM_TYPE_LABELS} from "@/modules/admin/types/rooms.types.ts";

// ============================================
// SUB-COMPONENTS
// ============================================

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-muted-foreground mt-0.5 shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="font-medium text-sm break-words">{value}</p>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
      {children}
    </h3>
  );
}

function GuestCard({ guest, index }: { guest: GuestInfo; index: number }) {
  const sexLabel: Record<string, string> = { M: 'Masculino', F: 'Femenino', O: 'otro' };
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border/50">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <span className="text-xs font-semibold text-primary">{index + 1}</span>
      </div>
      <div>
        <p className="font-medium text-sm">
          {guest.firstName} {guest.lastName}
        </p>
        <p className="text-xs text-muted-foreground">{sexLabel[guest.sex] ?? guest.sex}</p>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

interface ReservationDetailSheetProps {
  reservation: ReservationWithDetails | null;
  open: boolean;
  onClose: () => void;
  onEdit: (reservation: ReservationWithDetails) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: ReservationStatus) => void;
}

// ============================================
// DATE HELPERS
// ============================================

/**
 * Safely parse a date string. Handles ISO strings, yyyy-MM-dd, and Date objects.
 * Returns null if the value is falsy or produces an invalid date.
 */
function safeParseDate(value: string | Date | undefined | null): Date | null {
  if (!value) return null;
  // If it's already a Date, validate it
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  // Append time for date-only strings to avoid UTC midnight parsing issues
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value;
  const d = new Date(normalized);
  return isNaN(d.getTime()) ? null : d;
}

function safeFormat(
  value: string | Date | undefined | null,
  fmt: string,
  options?: Parameters<typeof format>[2]
): string {
  const d = safeParseDate(value);
  if (!d) return '—';
  return format(d, fmt, options);
}

// ============================================
// MAIN COMPONENT
// ============================================

export function ReservationDetailSheet({
  reservation,
  open,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}: ReservationDetailSheetProps) {
  if (!reservation) return null;

  const checkIn = safeParseDate(reservation.checkInDate);
  const checkOut = safeParseDate(reservation.checkOutDate);
  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;

  const sexLabel: Record<string, string> = { M: 'Masculino', F: 'Femenino', O: 'otro' };
  const totalGuests = reservation.baseGuestsCount + reservation.extraGuestsCount;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto flex flex-col gap-6">
        {/* Header */}
        <SheetHeader className="space-y-2">
          <div className="flex items-center justify-between pr-6">
            <SheetTitle className="text-lg">Detalle de Reserva #{reservation.id}</SheetTitle>
            <Badge variant={RESERVATION_STATUS_VARIANTS[reservation.status]}>
              {RESERVATION_STATUS_LABELS[reservation.status]}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Creada el {safeFormat(reservation.createdAt, "dd MMM yyyy 'a las' HH:mm", { locale: es })}
          </p>
        </SheetHeader>

        <Separator />

        {/* Room Section */}
        <div className="space-y-3">
          <SectionTitle>Habitación</SectionTitle>
          <DetailRow
            icon={<BedDouble size={15} />}
            label="Número"
            value={reservation.room?.number || `#${reservation.roomId}`}
          />
          {reservation.room?.name && (
            <DetailRow
              icon={<BedDouble size={15} />}
              label="Nombre"
              value={reservation.room.name}
            />
          )}
          {reservation.room?.roomType && (
            <DetailRow
              icon={<BedDouble size={15} />}
              label="Tipo"
              value={ROOM_TYPE_LABELS[reservation.room.roomType]}
            />
          )}
        </div>

        <Separator />

        {/* Dates Section */}
        <div className="space-y-3">
          <SectionTitle>Fechas y Duración</SectionTitle>
          <DetailRow
            icon={<Sunrise size={15} />}
            label="Entrada"
            value={safeFormat(reservation.checkInDate, 'dd MMM yyyy', { locale: es })}
          />
          <DetailRow
            icon={<Sunset size={15} />}
            label="Salida"
            value={safeFormat(reservation.checkOutDate, 'dd MMM yyyy', { locale: es })}
          />
          <DetailRow
            icon={<Moon size={15} />}
            label="Noches"
            value={`${nights} ${nights === 1 ? 'noche' : 'noches'}`}
          />
          {reservation.earlyCheckIn && (
            <DetailRow
              icon={<Clock size={15} />}
              label="Early check-in "
              value="Solicitado"
            />
          )}
          {reservation.lateCheckOut && (
            <DetailRow
              icon={<Clock size={15} />}
              label="Late check-out "
              value="Solicitado"
            />
          )}
        </div>

        <Separator />

        {/* Price Section */}
        <div className="space-y-3">
          <SectionTitle>Precio</SectionTitle>
          <DetailRow
            icon={<DollarSign size={15} />}
            label="Total"
            value={
              <span className="text-base font-bold text-primary">
                ${(Number(reservation.totalPrice) || 0).toFixed(2)}
              </span>
            }
          />
          <DetailRow
            icon={<Users size={15} />}
            label="Huéspedes"
            value={
              <span>
                {totalGuests}{' '}
                {reservation.extraGuestsCount > 0 && (
                  <span className="text-muted-foreground font-normal text-xs">
                    ({reservation.baseGuestsCount} base + {reservation.extraGuestsCount} extra)
                  </span>
                )}
              </span>
            }
          />
        </div>

        <Separator />

        {/* Main Guest Section */}
        <div className="space-y-3">
          <SectionTitle>Huésped Principal</SectionTitle>
          <DetailRow
            icon={<User size={15} />}
            label="Nombre completo"
            value={`${reservation.mainGuest.firstName} ${reservation.mainGuest.lastName}`}
          />
          <DetailRow
            icon={<User size={15} />}
            label="Sexo"
            value={sexLabel[reservation.mainGuest.sex] ?? reservation.mainGuest.sex}
          />
          <DetailRow
            icon={<Mail size={15} />}
            label="Email"
            value={
              <a
                href={`mailto:${reservation.mainGuest.email}`}
                className="text-primary hover:underline"
              >
                {reservation.mainGuest.email}
              </a>
            }
          />
          {reservation.mainGuest.phone && (
            <DetailRow
              icon={<Phone size={15} />}
              label="Teléfono"
              value={
                <a
                  href={`tel:${reservation.mainGuest.phone}`}
                  className="text-primary hover:underline"
                >
                  {reservation.mainGuest.phone}
                </a>
              }
            />
          )}
          {reservation.mainGuest.idNumber && (
            <DetailRow
              icon={<User size={15} />}
              label="CI / Pasaporte"
              value={reservation.mainGuest.idNumber}
            />
          )}
        </div>

        {/* Additional Guests Section */}
        {reservation.additionalGuests && reservation.additionalGuests.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <SectionTitle>
                Huéspedes Adicionales ({reservation.additionalGuests.length})
              </SectionTitle>
              <div className="space-y-2">
                {reservation.additionalGuests.map((guest, i) => (
                  <GuestCard key={i} guest={guest} index={i} />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Notes Section */}
        {reservation.notes && (
          <>
            <Separator />
            <div className="space-y-3">
              <SectionTitle>Notas</SectionTitle>
              <div className="flex items-start gap-3">
                <StickyNote size={15} className="text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-sm leading-relaxed">{reservation.notes}</p>
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Servicios Adicionales Section */}
        {(reservation.breakfasts > 0 || reservation.transferOneWay || reservation.transferRoundTrip) && (
          <div className="space-y-3">
            <SectionTitle>Servicios Adicionales</SectionTitle>
            {reservation.breakfasts > 0 && (
              <DetailRow
                icon={<Users size={15} />}
                label="Desayunos"
                value={`${reservation.breakfasts} ${reservation.breakfasts === 1 ? 'desayuno' : 'desayunos'}`}
              />
            )}
            {reservation.transferOneWay && (
              <DetailRow
                icon={<Car size={15} />}
                label="Traslado"
                value="Recogida del aeropuerto"
              />
            )}
            {reservation.transferRoundTrip && (
              <DetailRow
                icon={<Car size={15} />}
                label="Traslado"
                value="Retorno al aeropuerto"
              />
            )}
          </div>
        )}

        <Separator />

        {/* Actions */}
        <div className="space-y-2 pb-2">
          <SectionTitle>Acciones</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {canConfirmReservation(reservation.status) && (
              <Button
                size="sm"
                variant="outline"
                className="text-green-600 border-green-200 hover:bg-green-50"
                onClick={() => {
                  onStatusChange(reservation.id, ReservationStatus.CONFIRMED);
                  onClose();
                }}
              >
                <CheckCircle size={14} className="mr-1.5" />
                Confirmar
              </Button>
            )}
            {canCancelReservation(reservation.status) && (
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => {
                  onStatusChange(reservation.id, ReservationStatus.CANCELLED);
                  onClose();
                }}
              >
                <XCircle size={14} className="mr-1.5" />
                Cancelar
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                onEdit(reservation);
                onClose();
              }}
            >
              <Edit size={14} className="mr-1.5" />
              Editar
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={() => {
                onDelete(reservation.id);
                onClose();
              }}
            >
              <Trash2 size={14} className="mr-1.5" />
              Eliminar
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

