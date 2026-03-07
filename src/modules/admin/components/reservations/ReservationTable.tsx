// Reservation Table Component - Display reservations in admin panel
import { useState } from 'react';
import { format , parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, BedDouble, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/modules/shared/components/ui/button';
import { Badge } from '@/modules/shared/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/modules/shared/components/ui/table';
import {
  ReservationWithDetails,
  RESERVATION_STATUS_LABELS,
  RESERVATION_STATUS_VARIANTS,
  canConfirmReservation,
  canCancelReservation,
} from '../../types/reservations.types';
import { ReservationStatus } from '@/modules/shared/types/api.types';
import { ReservationDetailSheet } from './ReservationDetailSheet';

interface ReservationTableProps {
  reservations: ReservationWithDetails[];
  onEdit: (reservation: ReservationWithDetails) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: ReservationStatus) => void;
}



export function ReservationTable({
  reservations,
  onEdit,
  onDelete,
  onStatusChange,
}: ReservationTableProps) {
  const [selectedReservation, setSelectedReservation] = useState<ReservationWithDetails | null>(null);

  if (reservations.length === 0) {
    return null;
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Habitación</TableHead>
              <TableHead>Entrada</TableHead>
              <TableHead>Salida</TableHead>
              <TableHead>Huéspedes</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>

            {
              reservations.map(reservation => (

              <TableRow
                key={reservation.id}
                className="cursor-pointer hover:bg-muted/60 transition-colors"
                onClick={() => setSelectedReservation(reservation)}
              >
                {/* Room Info */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <BedDouble size={16} className="text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {reservation.room?.number || `#${reservation.roomId}`}
                      </p>
                      {reservation.room?.name && (
                        <p className="text-sm text-muted-foreground">
                          {reservation.room.name}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>

                {/* Check-in Date */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {format(parseISO(reservation.checkInDate), 'dd MMM yyyy', { locale: es })}
                    </span>
                  </div>
                </TableCell>

                {/* Check-out Date */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {format(parseISO(reservation.checkOutDate), 'dd MMM yyyy', { locale: es })}
                    </span>
                  </div>
                </TableCell>

                {/* Guests */}
                <TableCell>
                  <span className="font-medium">
                    {reservation.baseGuestsCount + reservation.extraGuestsCount}
                  </span>
                  {reservation.extraGuestsCount > 0 && (
                    <span className="text-xs text-muted-foreground block">
                      ({reservation.baseGuestsCount} base + {reservation.extraGuestsCount} extra)
                    </span>
                  )}
                </TableCell>

                {/* Total Price */}
                <TableCell>
                  <span className="font-semibold">
                    ${(Number(reservation.totalPrice) || 0).toFixed(2)}
                  </span>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge variant={RESERVATION_STATUS_VARIANTS[reservation.status]}>
                    {RESERVATION_STATUS_LABELS[reservation.status]}
                  </Badge>
                </TableCell>

                {/* Actions — stop propagation to avoid opening sheet */}
                <TableCell onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-2">
                    {canConfirmReservation(reservation.status) && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onStatusChange(reservation.id, ReservationStatus.CONFIRMED)}
                        title="Confirmar reserva"
                      >
                        <CheckCircle size={16} className="text-green-600" />
                      </Button>
                    )}
                    {canCancelReservation(reservation.status) && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onStatusChange(reservation.id, ReservationStatus.CANCELLED)}
                        title="Cancelar reserva"
                      >
                        <XCircle size={16} className="text-red-600" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(reservation)}
                      title="Editar"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(reservation.id)}
                      title="Eliminar"
                    >
                      <Trash2 size={16} className="text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {reservations.map(reservation => (
          <div
            key={reservation.id}
            className="border rounded-lg p-4 bg-card hover:bg-muted/60 transition-colors cursor-pointer"
            onClick={() => setSelectedReservation(reservation)}
          >
            {/* Room and Status */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <BedDouble size={18} className="text-muted-foreground shrink-0" />
                <div>
                  <p className="font-semibold text-base">
                    {reservation.room?.number || `#${reservation.roomId}`}
                  </p>
                  {reservation.room?.name && (
                    <p className="text-sm text-muted-foreground">
                      {reservation.room.name}
                    </p>
                  )}
                </div>
              </div>
              <Badge variant={RESERVATION_STATUS_VARIANTS[reservation.status]}>
                {RESERVATION_STATUS_LABELS[reservation.status]}
              </Badge>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Entrada</p>
                  <p className="font-medium">
                    {format(parseISO(reservation.checkInDate), 'dd MMM yyyy', { locale: es })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Salida</p>
                  <p className="font-medium">
                    {format(parseISO(reservation.checkOutDate), 'dd MMM yyyy', { locale: es })}
                  </p>
                </div>
              </div>
            </div>

            {/* Guests and Price */}
            <div className="flex items-center justify-between mb-3 pb-3 border-b">
              <div>
                <p className="text-xs text-muted-foreground">Huéspedes</p>
                <p className="font-medium">
                  {reservation.baseGuestsCount + reservation.extraGuestsCount}
                  {reservation.extraGuestsCount > 0 && (
                    <span className="text-xs text-muted-foreground ml-1">
                      ({reservation.baseGuestsCount} + {reservation.extraGuestsCount})
                    </span>
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-bold text-lg">
                  ${(Number(reservation.totalPrice) || 0).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
              {canConfirmReservation(reservation.status) && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStatusChange(reservation.id, ReservationStatus.CONFIRMED)}
                  className="flex-1"
                >
                  <CheckCircle size={16} className="text-green-600 mr-2" />
                  Confirmar
                </Button>
              )}
              {canCancelReservation(reservation.status) && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStatusChange(reservation.id, ReservationStatus.CANCELLED)}
                  className="flex-1"
                >
                  <XCircle size={16} className="text-red-600 mr-2" />
                  Cancelar
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(reservation)}
                title="Editar"
              >
                <Edit size={16} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(reservation.id)}
                title="Eliminar"
              >
                <Trash2 size={16} className="text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <ReservationDetailSheet
        reservation={selectedReservation}
        open={!!selectedReservation}
        onClose={() => setSelectedReservation(null)}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
      />
    </>
  );
}
