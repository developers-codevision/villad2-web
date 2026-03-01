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

  // Payment method selection step
  if (step === 'payment') {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold">Selecciona Método de Pago</h1>
          <p className="text-muted-foreground text-lg">
            Total a pagar: <span className="font-bold text-primary text-2xl">${totalPrice}</span>
          </p>
        </div>

        <div className="space-y-3">
          {/* Zelle */}
          <button
            onClick={() => hook.goToStep('payment-zelle')}
            className="w-full border-2 border-border rounded-lg p-4 flex items-center gap-4 hover:border-primary hover:bg-primary/5 transition-all duration-300 group text-left"
          >
            <span className="text-3xl">💸</span>
            <div className="flex-1">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">Zelle</h3>
              <p className="text-sm text-muted-foreground">Transferencia bancaria en EE.UU.</p>
            </div>
            <span className="text-xl text-muted-foreground group-hover:text-primary transition-colors">→</span>
          </button>

          {/* Bizum */}
          <button
            onClick={() => hook.goToStep('payment-bizum')}
            className="w-full border-2 border-border rounded-lg p-4 flex items-center gap-4 hover:border-primary hover:bg-primary/5 transition-all duration-300 group text-left"
          >
            <span className="text-3xl">📱</span>
            <div className="flex-1">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">Bizum</h3>
              <p className="text-sm text-muted-foreground">Transferencia instantánea en España</p>
            </div>
            <span className="text-xl text-muted-foreground group-hover:text-primary transition-colors">→</span>
          </button>

          {/* Stripe */}
          <button
            onClick={() => submitPayment('stripe')}
            disabled={submitting}
            className="w-full border-2 border-primary/50 rounded-lg p-4 flex items-center gap-4 hover:border-primary hover:bg-primary/10 transition-all duration-300 group text-left bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-3xl">💳</span>
            <div className="flex-1">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">Tarjeta de Crédito</h3>
              <p className="text-sm text-muted-foreground">Visa, Mastercard, American Express (Stripe)</p>
            </div>
            <span className="text-xl text-muted-foreground group-hover:text-primary transition-colors">→</span>
          </button>

          {/* PayPal */}
          <button
            disabled
            className="w-full border-2 border-border rounded-lg p-4 flex items-center gap-4 opacity-50 cursor-not-allowed text-left"
          >
            <span className="text-3xl">🅿️</span>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-muted-foreground">PayPal</h3>
              <p className="text-xs text-muted-foreground">Próximamente</p>
            </div>
          </button>
        </div>

        {/* Back button */}
        <div className="pt-4">
          <Button variant="outline" onClick={() => hook.previousStep()} className="w-full">
            ← Volver a detalles
          </Button>
        </div>
      </div>
    );
  }

  // Payment Zelle page
  if (step === 'payment-zelle') {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-center">Pago con Zelle</h1>
          <p className="text-muted-foreground text-center">Total a pagar: <span className="font-bold text-primary text-2xl">${totalPrice}</span></p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 space-y-4">
          <h2 className="font-semibold text-lg">Información de la Cuenta</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Email Zelle:</p>
              <p className="font-bold text-lg">pagos@villad2.com</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Nombre del titular:</p>
              <p className="font-bold text-lg">Villa D2</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monto a transferir:</p>
              <p className="font-bold text-lg text-primary">${totalPrice}</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold">Instrucciones:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Abre tu aplicación bancaria o Zelle</li>
            <li>Envía una transferencia a <strong>pagos@villad2.com</strong></li>
            <li>Monto <strong>${totalPrice}</strong> como monto</li>
            <li>Incluye tu número de reserva en el concepto (si es posible)</li>
            <li>Haz clic en el botón "Confirmar Pago" abajo</li>
          </ol>
        </div>

        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold">Recuerda:</p>
          <p className="text-sm text-muted-foreground">
            Recibirás un email de confirmación en menos de 24 horas. Si no lo recibes, contacta a nuestro equipo en los teléfonos del hostal.
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => hook.goToStep('payment')}
            className="flex-1"
          >
            ← Atrás
          </Button>
          <Button
            onClick={() => submitPayment('zelle')}
            disabled={submitting}
            className="flex-1 font-semibold"
          >
            {submitting ? 'Procesando...' : 'Confirmar Pago'}
          </Button>
        </div>
      </div>
    );
  }

  // Payment Bizum page
  if (step === 'payment-bizum') {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-center">Pago con Bizum</h1>
          <p className="text-muted-foreground text-center">Total a pagar: <span className="font-bold text-primary text-2xl">${totalPrice}</span></p>
        </div>

        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6 space-y-4">
          <h2 className="font-semibold text-lg">Información de Bizum</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Número de teléfono:</p>
              <p className="font-bold text-lg">+34 600 123 456</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Nombre del receptor:</p>
              <p className="font-bold text-lg">Villa D2</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monto a transferir:</p>
              <p className="font-bold text-lg text-primary">${totalPrice}</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold">Instrucciones:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Abre tu aplicación bancaria y ve a Bizum</li>
            <li>Selecciona "Enviar dinero"</li>
            <li>Ingresa el número <strong>+34 600 123 456</strong></li>
            <li>Monto: <strong>${totalPrice}</strong></li>
            <li>En el concepto, incluye tu número de reserva (si es posible)</li>
            <li>Confirma la transacción</li>
            <li>Haz clic en "Confirmar Pago" abajo</li>
          </ol>
        </div>

        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold">Recuerda:</p>
          <p className="text-sm text-muted-foreground">
            Recibirás un email de confirmación en menos de 24 horas. Si no lo recibes, contacta a nuestro equipo en los teléfonos del hostal.
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => hook.goToStep('payment')}
            className="flex-1"
          >
            ← Atrás
          </Button>
          <Button
            onClick={() => submitPayment('bizum')}
            disabled={submitting}
            className="flex-1 font-semibold"
          >
            {submitting ? 'Procesando...' : 'Confirmar Pago'}
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

  // Don't show calendar/form for payment method pages
  if (step === 'payment-zelle' || step === 'payment-bizum') {
    return null;
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


