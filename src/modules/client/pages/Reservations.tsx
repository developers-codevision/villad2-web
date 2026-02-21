// Client Reservations Page - Clean Architecture
// All business logic moved to hooks, utils, and types

import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CheckCircle } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/button";
import { Calendar } from "@/modules/shared/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/modules/shared/components/ui/select";
import { Input } from "@/modules/shared/components/ui/input";
import { Label } from "@/modules/shared/components/ui/label";
import { Textarea } from "@/modules/shared/components/ui/textarea";
import Navbar from "@/modules/shared/components/Navbar";
import Footer from "@/modules/shared/components/Footer";
import { ImageWithPlaceholder } from "@/modules/shared/components";
import { useRooms } from "@/modules/client/hooks/useRooms";
import { useClientReservation } from "@/modules/client/hooks/useClientReservation";
import { parsePhotos } from "@/modules/client/utils/roomHelpers";
import { roomsService } from "@/modules/shared/services/rooms.service";
import type { DateRange } from "react-day-picker";

export default function Reservations() {
  const [searchParams] = useSearchParams();
  const preselectedRoomId = searchParams.get("room");

  const { rooms, loading: loadingRooms } = useRooms();
  const {
    formData,
    submitting,
    confirmed,
    confirmationId,
    isStepComplete,
    reservationSummary,
    updateFormField,
    setDateRange,
    selectRoom,
    resetForm,
    submitReservation,
  } = useClientReservation();

  // Set preselected room if available
  useEffect(() => {
    if (preselectedRoomId && rooms.length > 0) {
      const roomId = parseInt(preselectedRoomId);
      if (!isNaN(roomId)) {
        selectRoom(roomId);
      }
    }
  }, [preselectedRoomId, rooms, selectRoom]);

  // Get selected room
  const selectedRoom = rooms.find(r => r.id === formData.roomId);

  // Get reservation summary
  const { nights, totalPrice } = reservationSummary(selectedRoom);

  // Can submit form
  const canSubmit =
    formData.checkIn &&
    formData.checkOut &&
    nights > 0 &&
    formData.roomId &&
    formData.guestFirstName &&
    formData.guestLastName &&
    formData.guestEmail &&
    formData.guestPhone;

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit && selectedRoom) {
      submitReservation(selectedRoom);
    }
  };

  // Confirmation screen
  if (confirmed) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-20 px-4 flex items-center justify-center min-h-[70vh]">
          <div className="text-center max-w-md">
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
                {nights} {nights === 1 ? "noche" : "noches"} · {formData.baseGuestsCount + formData.extraGuestsCount} {(formData.baseGuestsCount + formData.extraGuestsCount) === 1 ? "huésped" : "huéspedes"}
              </p>
              {formData.extraGuestsCount > 0 && (
                <p className="text-xs text-muted-foreground mb-2">
                  ({formData.baseGuestsCount} base + {formData.extraGuestsCount} extra)
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
            <Button
              className="font-semibold"
              onClick={resetForm}
            >
              Nueva Reserva
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Reservation form
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-3">
            Haz tu <span className="text-primary">Reserva</span>
          </h1>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Selecciona tus fechas, elige la habitación y completa tus datos.
          </p>

          {/* Date range calendar - full width */}
          <div className="space-y-2 mb-8">
            <Label className="text-base">Fechas de estancia</Label>
            <div className="border border-border rounded-lg p-6 flex justify-center">
              <Calendar
                mode="range"
                selected={{
                  from: formData.checkIn,
                  to: formData.checkOut,
                }}
                onSelect={(range: DateRange | undefined) => {
                  setDateRange(range?.from, range?.to);
                }}
                numberOfMonths={2}
                disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                locale={es}
                className="pointer-events-auto"
              />
            </div>
            {formData.checkIn && formData.checkOut && (
              <p className="text-sm text-muted-foreground text-center">
                {format(formData.checkIn, "dd MMM yyyy", { locale: es })} — {format(formData.checkOut, "dd MMM yyyy", { locale: es })} · {nights} {nights === 1 ? "noche" : "noches"}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3 space-y-6">

              {/* Room + guests */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Habitación</Label>
                  <Select
                    value={formData.roomId?.toString() || ''}
                    onValueChange={(value) => selectRoom(parseInt(value))}
                    disabled={loadingRooms}
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
                  <Label>Huéspedes Base</Label>
                  <Select
                    value={formData.baseGuestsCount.toString()}
                    onValueChange={(value) => updateFormField('baseGuestsCount', parseInt(value))}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n} {n === 1 ? "huésped" : "huéspedes"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Extra guests */}
              <div className="space-y-2">
                <Label>Huéspedes Extra (${5}/huésped/noche)</Label>
                <Select
                  value={formData.extraGuestsCount.toString()}
                  onValueChange={(value) => updateFormField('extraGuestsCount', parseInt(value))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} {n === 1 ? "huésped" : "huéspedes"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Guest info */}
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
                    onValueChange={(value) => updateFormField('guestSex', value as 'M' | 'F' | 'O')}
                  >
                    <SelectTrigger id="sex">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Femenino</SelectItem>
                      <SelectItem value="O">Otro</SelectItem>
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

              {/* Special Requests */}
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

            {/* Summary sidebar */}
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
                      {selectedRoom.roomType} · Hasta {selectedRoom.capacity} {selectedRoom.capacity === 1 ? "persona" : "personas"}
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
                    <span className="text-muted-foreground">Huéspedes Base</span>
                    <span>{formData.baseGuestsCount}</span>
                  </div>
                  {formData.extraGuestsCount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Huéspedes Extra</span>
                      <span>{formData.extraGuestsCount} × $5/noche</span>
                    </div>
                  )}
                  {selectedRoom && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Precio/noche</span>
                        <span>${selectedRoom.pricePerNight}</span>
                      </div>
                      {formData.extraGuestsCount > 0 && (
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Extra guests</span>
                          <span>${nights * formData.extraGuestsCount * 5}</span>
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
        </div>
      </main>
      <Footer />
    </div>
  );
}

