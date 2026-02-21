// Reservation Form Dialog Component

import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/modules/shared/components/ui/button';
import { Input } from '@/modules/shared/components/ui/input';
import { Label } from '@/modules/shared/components/ui/label';
import { Textarea } from '@/modules/shared/components/ui/textarea';
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
              onValueChange={value => onFormChange('roomId', parseInt(value))}
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

          {/* Guest Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre del Huésped *</Label>
              <Input
                placeholder="Juan Pérez"
                value={formData.guestName}
                onChange={e => onFormChange('guestName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                placeholder="juan@email.com"
                value={formData.guestEmail}
                onChange={e => onFormChange('guestEmail', e.target.value)}
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label>Teléfono</Label>
            <Input
              type="tel"
              placeholder="+34 612 345 678"
              value={formData.guestPhone}
              onChange={e => onFormChange('guestPhone', e.target.value)}
            />
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

          {/* Number of Guests */}
          <div className="space-y-2">
            <Label>Número de Huéspedes *</Label>
            <Input
              type="number"
              min={1}
              value={formData.guests}
              onChange={e => onFormChange('guests', parseInt(e.target.value) || 1)}
            />
          </div>

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

          {/* Special Requests */}
          <div className="space-y-2">
            <Label>Peticiones Especiales</Label>
            <Textarea
              rows={3}
              placeholder="Cuna para bebé, llegada tardía, etc."
              value={formData.specialRequests}
              onChange={e => onFormChange('specialRequests', e.target.value)}
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

