// Reservation Form Dialog Component

import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/shared/components/ui/popover';
import { ReservationFormData, getReservationStatuses, RESERVATION_STATUS_LABELS } from '../../types/reservations.types';
import { Room } from '@/modules/shared/types/api.types';

interface ReservationFormDialogProps {
  open: boolean;
  isEditing: boolean;
  saving: boolean;
  formData: ReservationFormData;
  availableRooms: Room[];
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
  onClose,
  onSave,
  onFormChange,
}: ReservationFormDialogProps) {
  // Get selected room to calculate max capacity
  const selectedRoom = availableRooms.find(r => r.id === formData.roomId);
  const maxCapacity = selectedRoom
    ? selectedRoom.baseCapacity + selectedRoom.extraCapacity
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
            {isEditing ? 'Editar Reserva' : 'Nueva Reserva Manual'}
          </DialogTitle>
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

          {/* Check-in and Check-out Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha de Entrada *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.checkIn ? (
                      format(formData.checkIn, 'PPP', { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.checkIn}
                    onSelect={date => onFormChange('checkIn', date)}
                    disabled={date => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Fecha de Salida *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.checkOut ? (
                      format(formData.checkOut, 'PPP', { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.checkOut}
                    onSelect={date => onFormChange('checkOut', date)}
                    disabled={date =>
                      date < (formData.checkIn || new Date(new Date().setHours(0, 0, 0, 0)))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

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
                onValueChange={value => onFormChange('guestSex', value as 'M' | 'F' | 'O')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Femenino</SelectItem>
                  <SelectItem value="O">Otro</SelectItem>
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
                        newGuests[index] = { ...newGuests[index], sex: value as 'M' | 'F' | 'O' };
                        onFormChange('additionalGuests', newGuests);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Masculino</SelectItem>
                        <SelectItem value="F">Femenino</SelectItem>
                        <SelectItem value="O">Otro</SelectItem>
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
                onValueChange={value => onFormChange('status', value as any)}
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
                Check-in anticipado{' '}
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
                Check-out tardío{' '}
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
          <Button onClick={onSave} disabled={saving}>
            {saving ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Reserva'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

