import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/modules/shared/components/ui/button';
import { Checkbox } from '@/modules/shared/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/modules/shared/components/ui/select';
import { Input } from '@/modules/shared/components/ui/input';
import { Label } from '@/modules/shared/components/ui/label';
import { Textarea } from '@/modules/shared/components/ui/textarea';
import { ImageWithPlaceholder } from '@/modules/shared/components';
import { parsePhotos } from '@/modules/client/utils/roomHelpers';
import { roomsService } from '@/modules/shared/services/rooms.service';
import type { Room } from '@/modules/shared/types/api.types';
import { useEffect } from 'react';
import type { FormEvent } from 'react';
import { useClientReservation } from '@/modules/client/hooks/useClientReservation';
import {ROOM_TYPE_LABELS} from "@/modules/admin/types/rooms.types.ts";

type ReservationHook = ReturnType<typeof useClientReservation>;

interface Props {
  hook: ReservationHook;
  rooms: Room[];
  loadingRooms?: boolean;
  singleRoomId?: number;
}

export default function ReservationForm({ hook, rooms, loadingRooms = false, singleRoomId }: Props) {
  const {
    formData,
    step,
    submitting,
    confirmed,
    confirmationId,
    reservationSummary,
    updateFormField,
    selectRoom,
    resetForm,
    submitReservation,
    submitPayment,
    canSubmit,
  } = hook;

  useEffect(() => {
    if (singleRoomId != null) {
      selectRoom(singleRoomId);
    }
  }, [singleRoomId, selectRoom]);

  const selectedRoom = rooms.find(r => r.id === formData.roomId);
  const maxCapacity = selectedRoom ? selectedRoom.baseCapacity + selectedRoom.extraCapacity : 0;
  const { nights, totalPrice } = reservationSummary(selectedRoom);

  const handleTotalGuestsChange = (total: number) => {
    if (!selectedRoom) return;
    const baseGuestsCount = Math.min(total, selectedRoom.baseCapacity);
    const extraGuestsCount = Math.max(total - selectedRoom.baseCapacity, 0);
    updateFormField('totalGuests', total);
    updateFormField('baseGuestsCount', baseGuestsCount);
    updateFormField('extraGuestsCount', extraGuestsCount);
    const otherGuestsCount = total - 1;
    const currentAdditional = formData.additionalGuests || [];
    const newAdditional = Array.from({ length: otherGuestsCount }, (_, i) =>
      currentAdditional[i] || { firstName: '', lastName: '', sex: 'M' as const }
    );
    updateFormField('additionalGuests', newAdditional);
  };

  const handleRoomSelect = (roomId: number) => {
    selectRoom(roomId);
    if (formData.totalGuests > 0) {
      handleTotalGuestsChange(formData.totalGuests);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (canSubmit && selectedRoom) {
      submitReservation();
    }
  };

  if (step === 'payment') {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-center">Selecciona Método de Pago</h1>
          <p className="text-muted-foreground text-center text-lg">
            Elige cómo deseas pagar tu reserva de <span className="font-bold text-primary text-2xl">${totalPrice}</span>
          </p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Zelle */}
          <div className="border-2 border-border rounded-xl p-6 space-y-4 hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col">
            <div className="space-y-2 flex-1">
              <div className="inline-flex items-center gap-2 mb-2">
                <h3 className="font-bold text-lg">Zelle</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Transfiere el monto total a la siguiente cuenta Zelle:
              </p>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 rounded-lg p-4 text-sm space-y-2 border border-blue-200/50 dark:border-blue-800/50">
                <p><span className="text-muted-foreground">Email:</span> <strong>pagos@villad2.com</strong></p>
                <p><span className="text-muted-foreground">Nombre:</span> <strong>Villa D2</strong></p>
              </div>
            </div>
            <Button
              onClick={() => submitPayment('zelle')}
              disabled={submitting}
              className="w-full font-semibold"
            >
              {submitting ? 'Procesando...' : 'Confirmar con Zelle'}
            </Button>
          </div>

          {/* Bizum */}
          <div className="border-2 border-border rounded-xl p-6 space-y-4 hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col">
            <div className="space-y-2 flex-1">
              <div className="inline-flex items-center gap-2 mb-2">
                <h3 className="font-bold text-lg">Bizum</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Envía el pago a través de Bizum al siguiente número:
              </p>
              <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 rounded-lg p-4 text-sm space-y-2 border border-green-200/50 dark:border-green-800/50">
                <p><span className="text-muted-foreground">Número:</span> <strong>+34 600 123 456</strong></p>
                <p><span className="text-muted-foreground">Concepto:</span> <strong>Reserva #{confirmationId}</strong></p>
              </div>
            </div>
            <Button
              onClick={() => submitPayment('bizum')}
              disabled={submitting}
              className="w-full font-semibold"
            >
              {submitting ? 'Procesando...' : 'Confirmar con Bizum'}
            </Button>
          </div>

          {/* Stripe */}
          <div className="border-2 border-border rounded-xl p-6 space-y-4 hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col bg-gradient-to-br from-purple-50/30 to-transparent dark:from-purple-950/10">
            <div className="space-y-2 flex-1">
              <div className="inline-flex items-center gap-2 mb-2">
                <h3 className="font-bold text-lg">Tarjeta de Crédito</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Paga de forma segura con Stripe. Acepta todas las tarjetas principales.
              </p>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 rounded-lg p-4 text-sm space-y-2 border border-purple-200/50 dark:border-purple-800/50">
                <p className="text-xs text-muted-foreground">Procesamiento instantáneo</p>
              </div>
            </div>
            <Button
              onClick={() => submitPayment('stripe')}
              disabled={submitting}
              className="w-full font-semibold bg-primary hover:bg-primary/90"
            >
              {submitting ? 'Procesando...' : 'Pagar con Stripe'}
            </Button>
          </div>
        </div>

        {/* Back button */}
        <div className="text-center pt-4">
          <Button variant="outline" onClick={() => hook.previousStep()}>
            ← Volver a detalles
          </Button>
        </div>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className="text-center max-w-md mx-auto">
        <CheckCircle size={64} className="text-primary mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-3">¡Reserva Solicitada!</h1>
        <p className="text-muted-foreground mb-2">
          Gracias, <strong>{formData.guestFirstName} {formData.guestLastName}</strong>. Tu solicitud de reserva ha sido registrada.
        </p>
        {confirmationId && (
          <p className="text-sm text-muted-foreground mb-4">
            Número de confirmación: <strong>#{confirmationId}</strong>
          </p>
        )}
        <div className="bg-muted/30 rounded-lg p-4 mb-4">
          <p className="font-semibold mb-2">{selectedRoom?.name}</p>
          <p className="text-sm text-muted-foreground mb-2">
            {formData.checkIn && format(formData.checkIn, "dd MMM yyyy", { locale: es })} — {formData.checkOut && format(formData.checkOut, "dd MMM yyyy", { locale: es })}
          </p>
          <p className="text-sm text-muted-foreground mb-2">
            {nights} {nights === 1 ? "noche" : "noches"} · {formData.totalGuests} {formData.totalGuests === 1 ? "huésped" : "huéspedes"}
          </p>
          {formData.extraGuestsCount > 0 && (
            <p className="text-xs text-muted-foreground mb-2">
              Incluye {formData.extraGuestsCount} huésped{formData.extraGuestsCount === 1 ? '' : 'es'} adicional{formData.extraGuestsCount === 1 ? '' : 'es'}
            </p>
          )}
          <p className="text-2xl font-bold text-primary mt-2">${totalPrice}</p>
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          Tu reserva está <strong>pendiente de confirmación</strong>.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Recibirás un email en <strong>{formData.guestEmail}</strong> cuando sea confirmada por el administrador.
        </p>
        <Button className="font-semibold" onClick={resetForm}>Nueva Reserva</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-3 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Habitación</Label>
            <Select
              value={formData.roomId?.toString() || ''}
              onValueChange={(value) => handleRoomSelect(parseInt(value))}
              disabled={loadingRooms || !!singleRoomId}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingRooms ? "Cargando..." : "Seleccionar habitación"} />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((r) => (
                  <SelectItem key={r.id} value={r.id.toString()}>
                    {r.name} — ${r.pricePerNight}/noche
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Huéspedes Totales</Label>
            <Select
              value={formData.totalGuests.toString()}
              onValueChange={(value) => handleTotalGuestsChange(parseInt(value))}
              disabled={!selectedRoom}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Array.from({ length: Math.max(maxCapacity, 1) }, (_, i) => i + 1).map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} {n === 1 ? "huésped" : "huéspedes"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Datos del Huésped Principal</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre</Label>
              <Input
                id="firstName"
                value={formData.guestFirstName}
                onChange={(e) => updateFormField('guestFirstName', e.target.value)}
                placeholder="Juan"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                value={formData.guestLastName}
                onChange={(e) => updateFormField('guestLastName', e.target.value)}
                placeholder="Pérez"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sex">Sexo</Label>
            <Select
              value={formData.guestSex}
              onValueChange={(value) => updateFormField('guestSex', value as 'M' | 'F' | 'otro')}
            >
              <SelectTrigger id="sex">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Masculino</SelectItem>
                <SelectItem value="F">Femenino</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.guestEmail}
                onChange={(e) => updateFormField('guestEmail', e.target.value)}
                placeholder="tu@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.guestPhone}
                onChange={(e) => updateFormField('guestPhone', e.target.value)}
                placeholder="+51 987 654 321"
                required
              />
            </div>
          </div>
        </div>
        {formData.additionalGuests.length > 0 && (
          <div className="space-y-4">
            {formData.additionalGuests.map((guest, index) => (
              <div key={index} className="border border-border rounded-lg p-4 space-y-4">
                <h4 className="font-medium">Acompañante #{index + 1}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nombre</Label>
                    <Input
                      value={guest.firstName}
                      onChange={(e) => {
                        const newGuests = [...formData.additionalGuests];
                        newGuests[index] = { ...newGuests[index], firstName: e.target.value };
                        updateFormField('additionalGuests', newGuests);
                      }}
                      placeholder="Juan"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Apellido</Label>
                    <Input
                      value={guest.lastName}
                      onChange={(e) => {
                        const newGuests = [...formData.additionalGuests];
                        newGuests[index] = { ...newGuests[index], lastName: e.target.value };
                        updateFormField('additionalGuests', newGuests);
                      }}
                      placeholder="Pérez"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Sexo</Label>
                  <Select
                    value={guest.sex}
                    onValueChange={(value) => {
                      const newGuests = [...formData.additionalGuests];
                      newGuests[index] = { ...newGuests[index], sex: value as 'M' | 'F' | 'otro' };
                      updateFormField('additionalGuests', newGuests);
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
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Opciones de Llegada y Salida</h3>
          <div className="flex items-center gap-3">
            <Checkbox
              id="earlyCheckIn"
              checked={formData.earlyCheckIn}
              onCheckedChange={(checked) => updateFormField('earlyCheckIn', !!checked)}
            />
            <Label htmlFor="earlyCheckIn" className="cursor-pointer font-normal">
              Check-in anticipado <span className="text-muted-foreground text-sm">(solicitar llegada antes del horario estándar)</span>
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox
              id="lateCheckOut"
              checked={formData.lateCheckOut}
              onCheckedChange={(checked) => updateFormField('lateCheckOut', !!checked)}
            />
            <Label htmlFor="lateCheckOut" className="cursor-pointer font-normal">
              Check-out tardío <span className="text-muted-foreground text-sm">(solicitar salida después del horario estándar)</span>
            </Label>
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Servicios de Transporte</h3>
          <div className="flex items-center gap-3">
            <Checkbox
              id="transferOneWay"
              checked={formData.transferOneWay}
              onCheckedChange={(checked) => updateFormField('transferOneWay', !!checked)}
            />
            <Label htmlFor="transferOneWay" className="cursor-pointer font-normal">
              Recogida de el aereopuerto <span className="text-muted-foreground text-sm"></span>
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox
              id="transferRoundTrip"
              checked={formData.transferRoundTrip}
              onCheckedChange={(checked) => updateFormField('transferRoundTrip', !!checked)}
            />
            <Label htmlFor="transferRoundTrip" className="cursor-pointer font-normal">
              Retorno al aereopuerto <span className="text-muted-foreground text-sm"></span>
            </Label>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="breakfasts">Desayunos Incluidos</Label>
          <Select
            value={formData.breakfasts.toString()}
            onValueChange={(value) => updateFormField('breakfasts', parseInt(value))}
          >
            <SelectTrigger id="breakfasts">
              <SelectValue placeholder="Seleccionar cantidad de desayunos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Sin desayunos</SelectItem>
              {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} {n === 1 ? "desayuno" : "desayunos"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="requests">Notas o Peticiones Especiales (Opcional)</Label>
          <Textarea
            id="requests"
            rows={3}
            value={formData.notes}
            onChange={(e) => updateFormField('notes', e.target.value)}
            placeholder="Llegada tardía, cuna para bebé, etc."
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="w-full font-bold text-lg py-6"
          disabled={!canSubmit || submitting}
        >
          {submitting ? 'Procesando...' : 'Confirmar Reserva'}
        </Button>
      </div>
      <div className="lg:col-span-2">
        <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
          <h3 className="font-bold text-lg mb-4">Resumen de Reserva</h3>
          {selectedRoom ? (
            <>
              {(() => {
                const mainPhotoArray = parsePhotos(selectedRoom.mainPhoto);
                const mainImage = mainPhotoArray.length > 0
                  ? roomsService.getMediaUrl(mainPhotoArray[0])
                  : '/placeholder.svg';
                return (
                  <ImageWithPlaceholder
                    src={mainImage}
                    alt={selectedRoom.name}
                    className="rounded-lg w-full h-40 object-cover mb-4"
                    loading="lazy"
                  />
                );
              })()}
              <p className="font-semibold">{selectedRoom.name}</p>
              <p className="text-sm text-muted-foreground mb-4">
                {ROOM_TYPE_LABELS[selectedRoom.roomType]} · Hasta {maxCapacity} {maxCapacity === 1 ? "persona" : "personas"}
              </p>
            </>
          ) : (
            <p className="text-muted-foreground text-sm mb-4">Selecciona una habitación</p>
          )}
          <div className="border-t border-border pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Check-in</span>
              <span>{formData.checkIn ? format(formData.checkIn, "dd MMM yyyy", { locale: es }) : "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Check-out</span>
              <span>{formData.checkOut ? format(formData.checkOut, "dd MMM yyyy", { locale: es }) : "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Noches</span>
              <span>{nights}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Huéspedes</span>
              <span>{formData.totalGuests}</span>
            </div>
            {formData.earlyCheckIn && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Check-in anticipado</span>
                <span className="text-primary">✓</span>
              </div>
            )}
            {formData.lateCheckOut && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Check-out tardío</span>
                <span className="text-primary">✓</span>
              </div>
            )}
            {formData.transferOneWay && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Transporte ida</span>
                <span className="text-primary">✓</span>
              </div>
            )}
            {formData.transferRoundTrip && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Transporte ida y vuelta</span>
                <span className="text-primary">✓</span>
              </div>
            )}
            {formData.breakfasts > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Desayunos</span>
                <span>{formData.breakfasts}</span>
              </div>
            )}
            {selectedRoom && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Precio/noche</span>
                  <span>${selectedRoom.pricePerNight}</span>
                </div>
                {formData.extraGuestsCount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Huéspedes adicionales</span>
                    <span>+${formData.extraGuestsCount * selectedRoom.extraGuestCharge * nights}</span>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="border-t border-border mt-4 pt-4 flex justify-between items-center">
            <span className="font-bold text-lg">Total</span>
            <span className="font-bold text-2xl text-primary">${totalPrice}</span>
          </div>
        </div>
      </div>
    </form>
  );
}
