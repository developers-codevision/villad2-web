import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CheckCircle } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/button";
import { Calendar } from "@/modules/shared/components/ui/calendar";
import { Label } from "@/modules/shared/components/ui/label";
import Navbar from "@/modules/shared/components/Navbar";
import Footer from "@/modules/shared/components/Footer";
import { useRooms } from "@/modules/client/hooks/useRooms";
import { useClientReservation } from "@/modules/client/hooks/useClientReservation";
import { usePrices } from "@/modules/shared/hooks";
import ReservationForm from "@/modules/client/components/ReservationForm";
import type { DateRange } from "react-day-picker";

export default function Reservations() {
  const [searchParams] = useSearchParams();
  const preselectedRoomId = searchParams.get("room");

  const { rooms, availableRooms, loading: loadingRooms } = useRooms();
  const { prices } = usePrices();
  const reservationHook = useClientReservation(prices);
  const {
    formData,
    confirmed,
    confirmationId,
    paymentMethod,
    reservationSummary,
    setDateRange,
    resetForm,
    occupiedDates,
    selectRoom,
  } = reservationHook;

  useEffect(() => {
    if (preselectedRoomId && rooms.length > 0) {
      const roomId = parseInt(preselectedRoomId);
      if (!isNaN(roomId)) {
        selectRoom(roomId);
      }
    }
  }, [preselectedRoomId, rooms, selectRoom]);

  const selectedRoom = rooms.find(r => r.id === formData.roomId);
  const { nights, totalPrice } = reservationSummary(selectedRoom);

  const hideCalendarAndHeader = ['payment', 'payment-zelle', 'payment-bizum'].includes(
    reservationHook.step as string
  );

  // Function to check if a date range contains any occupied dates
  const isDateRangeAvailable = (checkIn: Date, checkOut: Date): boolean => {
    const current = new Date(checkIn);
    while (current < checkOut) {
      const dateStr = format(current, "yyyy-MM-dd");
      if (occupiedDates.includes(dateStr)) {
        return false;
      }
      current.setDate(current.getDate() + 1);
    }
    return true;
  };

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
            <div className="bg-muted/30 rounded-lg p-4 mb-4">
              <p className="font-semibold mb-2">{selectedRoom?.name}</p>
              <p className="text-sm text-muted-foreground mb-2">
                {formData.checkIn && format(formData.checkIn, "dd MMM yyyy", { locale: es })} —{" "}
                {formData.checkOut && format(formData.checkOut, "dd MMM yyyy", { locale: es })}
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                {nights} {nights === 1 ? "noche" : "noches"} · {formData.totalGuests}{" "}
                {formData.totalGuests === 1 ? "huésped" : "huéspedes"}
              </p>
              {formData.extraGuestsCount > 0 && (
                <p className="text-xs text-muted-foreground mb-2">
                  Incluye {formData.extraGuestsCount} huésped{formData.extraGuestsCount === 1 ? "" : "es"} adicional
                  {formData.extraGuestsCount === 1 ? "" : "es"}
                </p>
              )}
              <p className="text-2xl font-bold text-primary mt-2">${totalPrice}</p>
            </div>
            {paymentMethod === 'zelle' || paymentMethod === 'bizum' ? (
              <p className="text-sm text-muted-foreground mb-6">
                Recibirás un email en <strong>{formData.guestEmail}</strong> cuando sea confirmada por el administrador.
              </p>
            ) : null}
            <Button className="font-semibold" onClick={resetForm}>
              Nueva Reserva
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-3">
            Haz tu <span className="text-primary">Reserva</span>
          </h1>

          {!hideCalendarAndHeader && (
            <>
              <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
                Selecciona tus fechas, elige la habitación y completa tus datos.
              </p>
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
                      if (range?.from && range?.to) {
                        if (!isDateRangeAvailable(range.from, range.to)) {
                          return;
                        }
                      }
                      setDateRange(range?.from, range?.to);
                    }}
                    numberOfMonths={2}
                    disabled={(d) =>
                      !selectedRoom ||
                      d < new Date(new Date().setHours(0, 0, 0, 0)) ||
                      (!!selectedRoom && occupiedDates.includes(format(d, "yyyy-MM-dd")))
                    }
                    locale={es}
                    className="pointer-events-auto"
                  />
                </div>
                {formData.checkIn && formData.checkOut && (
                  <p className="text-sm text-muted-foreground text-center">
                    {format(formData.checkIn, "dd MMM yyyy", { locale: es })} —{" "}
                    {format(formData.checkOut, "dd MMM yyyy", { locale: es })} · {nights}{" "}
                    {nights === 1 ? "noche" : "noches"}
                  </p>
                )}
              </div>
            </>
          )}

          <ReservationForm
            hook={reservationHook}
            rooms={availableRooms}
            loadingRooms={loadingRooms}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}