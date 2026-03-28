// Reservation Form Dialog Component

import { useState, useEffect } from 'react';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Moon, Clock } from 'lucide-react';
import { Button } from '@/modules/shared/components/ui/button';
import { Input } from '@/modules/shared/components/ui/input';
import { Label } from '@/modules/shared/components/ui/label';
import { Textarea } from '@/modules/shared/components/ui/textarea';
import { Checkbox } from '@/modules/shared/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/modules/shared/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/shared/components/ui/select';
import { Calendar } from '@/modules/shared/components/ui/calendar';
import { ReservationFormData, getReservationStatuses, RESERVATION_STATUS_LABELS } from '../../types/reservations.types';
import { Room } from '@/modules/shared/types/api.types';
import { ReservationStatus } from '@/modules/shared/types/api.types';
import type { DateRange } from 'react-day-picker';

type BookingMode = 'range' | 'single';

interface ReservationFormDialogProps {
  open: boolean;
  isEditing: boolean;
  saving: boolean;
  formData: ReservationFormData;
  availableRooms: Room[];
  occupiedDates: string[];
  onClose: () => void;
  onSave: () => void;
  onFormChange: <K extends keyof ReservationFormData>(
    field: K,
    value: ReservationFormData[K]
  ) => void;
}

export function ReservationFormDialog({
  open,
  isEditing,
  saving,
  formData,
  availableRooms,
  occupiedDates,
  onClose,
  onSave,
  onFormChange,
  canSubmit,
}: ReservationFormDialogProps & { canSubmit: boolean }) {

  // Booking mode: 'range' = multi-night, 'single' = same-day by hours
  const [bookingMode, setBookingMode] = useState<BookingMode>('range');

  // Auto-detect mode from existing reservation data when editing
  useEffect(() => {
    if (open && isEditing && formData.checkIn && formData.checkOut) {
      setBookingMode(isSameDay(formData.checkIn, formData.checkOut) ? 'single' : 'range');
    }
    if (!open) {
      setBookingMode('range');
    }
  }, [open, isEditing]);

  // Switch mode and clear date fields
  const handleModeChange = (mode: BookingMode) => {
    if (mode === bookingMode) return;
    setBookingMode(mode);
    onFormChange('checkIn', undefined);
    onFormChange('checkOut', undefined);
    onFormChange('checkInTime', '');
    onFormChange('checkOutTime', '');
  };

  // Get selected room to calculate max capacity
  const selectedRoom = availableRooms.find(r => r.id === formData.roomId);
  const maxCapacity = selectedRoom
    ? selectedRoom.baseCapacity + selectedRoom.extraCapacity
    : 0;

  // Calculate nights (range mode only)
  const nights =
    bookingMode === 'range' && formData.checkIn && formData.checkOut
      ? Math.ceil(
          (formData.checkOut.getTime() - formData.checkIn.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  // Handle total guests change (mirrors client logic)
  const handleTotalGuestsChange = (total: number) => {
    if (!selectedRoom) return;

    const baseGuestsCount = Math.min(total, selectedRoom.baseCapacity);
    const extraGuestsCount = Math.max(total - selectedRoom.baseCapacity, 0);

    onFormChange('totalGuests', total);
    onFormChange('baseGuestsCount', baseGuestsCount);
    onFormChange('extraGuestsCount', extraGuestsCount);

    // Additional guests = all companions except the main guest (total - 1)
    const companionsCount = total - 1;
    const currentAdditional = formData.additionalGuests || [];
    const newAdditional = Array.from({ length: companionsCount }, (_, i) =>
      currentAdditional[i] || { firstName: '', lastName: '', sex: 'M' as const }
    );
    onFormChange('additionalGuests', newAdditional);
  };

  // Handle room selection
  const handleRoomSelect = (roomId: number) => {
    onFormChange('roomId', roomId);
    // Reset guests when room changes
    if (formData.totalGuests > 0) {
      handleTotalGuestsChange(formData.totalGuests);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Reserva' : 'Nueva Reserva'}
          </DialogTitle>

          {/* Booking mode toggle */}
          <div className="flex items-center gap-1 mt-2 border rounded-lg p-1 w-fit">
            <button
              type="button"
              onClick={() => handleModeChange('range')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                bookingMode === 'range'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Moon size={14} />
              Por noches
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('single')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                bookingMode === 'single'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Clock size={14} />
              Por horas (un día)
            </button>
          </div>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Room Selection */}
          <div className="space-y-2">
            <Label>Habitación *</Label>
            <Select
              value={formData.roomId?.toString() || ''}
              onValueChange={value => handleRoomSelect(parseInt(value))}
              disabled={isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar habitación" />
              </SelectTrigger>
              <SelectContent>
                {availableRooms.map(room => (
                  <SelectItem key={room.id} value={room.id.toString()}>
                    {room.number} - {room.name} (${room.pricePerNight}/noche)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ── RANGE MODE: multi-night calendar ── */}
          {bookingMode === 'range' && (
            <div className="space-y-2">
              <Label className="text-base">Fechas de estancia</Label>
              <div className="border border-border rounded-lg p-6 flex justify-center">
                <Calendar
                  mode="range"
                  selected={{
                    from: formData.checkIn ?? undefined,
                    to: formData.checkOut ?? undefined,
                  }}
                  onSelect={(range: DateRange | undefined) => {
                    onFormChange('checkIn', range?.from);
                    onFormChange('checkOut', range?.to);
                  }}
                  numberOfMonths={2}
                  disabled={(d) =>
                    !selectedRoom ||
                    d < new Date(new Date().setHours(0, 0, 0, 0)) ||
                    (!!selectedRoom && occupiedDates.includes(format(d, 'yyyy-MM-dd')))
                  }
                  locale={es}
                  className="pointer-events-auto"
                />
              </div>
              {formData.checkIn && formData.checkOut && (
                <p className="text-sm text-muted-foreground text-center">
                  {format(formData.checkIn, 'dd MMM yyyy', { locale: es })} —{' '}
                  {format(formData.checkOut, 'dd MMM yyyy', { locale: es })} ·{' '}
                  {nights} {nights === 1 ? 'noche' : 'noches'}
                </p>
              )}
              {/* Optional arrival / departure times */}
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <Label>Hora de llegada (Check-in)</Label>
                  <Input
                    type="time"
                    value={formData.checkInTime || ''}
                    onChange={(e) => onFormChange('checkInTime', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hora de salida (Check-out)</Label>
                  <Input
                    type="time"
                    value={formData.checkOutTime || ''}
                    onChange={(e) => onFormChange('checkOutTime', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── SINGLE MODE: one-day calendar + required times ── */}
          {bookingMode === 'single' && (
            <div className="space-y-2">
              <Label className="text-base">Fecha de la reserva</Label>
              <div className="border border-border rounded-lg p-4 flex justify-center">
                <Calendar
                  mode="single"
                  selected={formData.checkIn ?? undefined}
                  onSelect={(day: Date | undefined) => {
                    onFormChange('checkIn', day);
                    onFormChange('checkOut', day);
                  }}
                  disabled={(d) =>
                    !selectedRoom ||
                    d < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  locale={es}
                  className="pointer-events-auto"
                />
              </div>
              {formData.checkIn && (
                <p className="text-sm text-muted-foreground text-center">
                  {format(formData.checkIn, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })}
                </p>
              )}
              {/* Required times */}
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <Label>Hora de entrada *</Label>
                  <Input
                    type="time"
                    value={formData.checkInTime || ''}
                    onChange={(e) => onFormChange('checkInTime', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hora de salida *</Label>
                  <Input
                    type="time"
                    value={formData.checkOutTime || ''}
                    onChange={(e) => onFormChange('checkOutTime', e.target.value)}
                  />
                </div>
              </div>
              {formData.checkInTime && formData.checkOutTime && (
                <p className="text-sm text-muted-foreground text-center">
                  {formData.checkInTime} — {formData.checkOutTime} · Reserva por horas
                </p>
              )}
            </div>
          )}

          {/* Guest Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Datos del Huésped Principal</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre *</Label>
                <Input
                  placeholder="Juan"
                  value={formData.guestFirstName}
                  onChange={e => onFormChange('guestFirstName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Apellido *</Label>
                <Input
                  placeholder="Pérez"
                  value={formData.guestLastName}
                  onChange={e => onFormChange('guestLastName', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sexo</Label>
              <Select
                value={formData.guestSex}
                onValueChange={value => onFormChange('guestSex', value as 'M' | 'F' | 'otro')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Femenino</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  placeholder="juan@email.com"
                  value={formData.guestEmail}
                  onChange={e => onFormChange('guestEmail', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Teléfono *</Label>
                <Input
                  type="tel"
                  placeholder="+51 987 654 321"
                  value={formData.guestPhone}
                  onChange={e => onFormChange('guestPhone', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Number of Guests */}
          <div className="space-y-2">
            <Label>Huéspedes Totales *</Label>
            <Select
              value={formData.totalGuests.toString()}
              onValueChange={value => handleTotalGuestsChange(parseInt(value))}
              disabled={!selectedRoom}
            >
              <SelectTrigger>
                <SelectValue placeholder={!selectedRoom ? 'Selecciona una habitación primero' : undefined} />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: maxCapacity }, (_, i) => i + 1).map(n => (
                  <SelectItem key={n} value={String(n)}>
                    {n} {n === 1 ? 'huésped' : 'huéspedes'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Additional Guests (all companions) */}
          {formData.additionalGuests.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Datos de Acompañantes</h3>
              {formData.additionalGuests.map((guest, index) => (
                <div key={index} className="border border-border rounded-lg p-4 space-y-4">
                  <h4 className="font-medium">Acompañante #{index + 1}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nombre</Label>
                      <Input
                        value={guest.firstName}
                        onChange={e => {
                          const newGuests = [...formData.additionalGuests];
                          newGuests[index] = { ...newGuests[index], firstName: e.target.value };
                          onFormChange('additionalGuests', newGuests);
                        }}
                        placeholder="Juan"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Apellido</Label>
                      <Input
                        value={guest.lastName}
                        onChange={e => {
                          const newGuests = [...formData.additionalGuests];
                          newGuests[index] = { ...newGuests[index], lastName: e.target.value };
                          onFormChange('additionalGuests', newGuests);
                        }}
                        placeholder="Pérez"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Sexo</Label>
                    <Select
                      value={guest.sex}
                      onValueChange={value => {
                        const newGuests = [...formData.additionalGuests];
                        newGuests[index] = { ...newGuests[index], sex: value as 'M' | 'F' | 'otro' };
                        onFormChange('additionalGuests', newGuests);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Masculino</SelectItem>
                        <SelectItem value="F">Femenino</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Status (only for editing) */}
          {isEditing && (
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select
                value={formData.status}
                onValueChange={value => onFormChange('status', value as ReservationStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getReservationStatuses().map(status => (
                    <SelectItem key={status} value={status}>
                      {RESERVATION_STATUS_LABELS[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Check-in / Check-out options */}
          <div className="space-y-3">
            <h3 className="font-semibold">Opciones de Llegada y Salida</h3>
            <div className="flex items-center gap-3">
              <Checkbox
                id="earlyCheckIn"
                checked={formData.earlyCheckIn}
                onCheckedChange={checked => onFormChange('earlyCheckIn', !!checked)}
              />
              <Label htmlFor="earlyCheckIn" className="cursor-pointer font-normal">
                Early check-in {' '}
                <span className="text-muted-foreground text-sm">
                  (solicitar llegada antes del horario estándar)
                </span>
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="lateCheckOut"
                checked={formData.lateCheckOut}
                onCheckedChange={checked => onFormChange('lateCheckOut', !!checked)}
              />
              <Label htmlFor="lateCheckOut" className="cursor-pointer font-normal">
                Late check-out {' '}
                <span className="text-muted-foreground text-sm">
                  (solicitar salida después del horario estándar)
                </span>
              </Label>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notas o Peticiones Especiales (Opcional)</Label>
            <Textarea
              rows={3}
              placeholder="Llegada tardía, cuna para bebé, etc."
              value={formData.notes}
              onChange={e => onFormChange('notes', e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={onSave} disabled={saving || !canSubmit}>
            {saving ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Reserva'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
