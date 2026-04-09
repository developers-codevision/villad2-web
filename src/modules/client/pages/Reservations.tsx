import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/modules/shared/components/ui/button";
import Navbar from "@/modules/shared/components/Navbar";
import Footer from "@/modules/shared/components/Footer";
import { useRooms } from "@/modules/client/hooks/useRooms";
import { useClientReservation } from "@/modules/client/hooks/useClientReservation";
import { usePrices } from "@/modules/shared/hooks";
import { ReservationForm } from "@/modules/client/components/reservation";
import { useLanguage } from "@/modules/client/contexts";
import type { DateRange } from "react-day-picker";

export default function Reservations() {
  const [searchParams] = useSearchParams();
  const preselectedRoomId = searchParams.get("room");
  const { t } = useLanguage();

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
            {t("reservation.pageTitle")}
          </h1>

          {!hideCalendarAndHeader && (
            <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
              {t("reservation.pageSubtitle")}
            </p>
          )}

          <ReservationForm
            hook={reservationHook}
            rooms={availableRooms}
            loadingRooms={loadingRooms}
          />

          {/* Additional Services CTA */}
          <section className="text-center py-12 mt-16 bg-accent/30 rounded-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              {t("room.additionalServices")} <span className="text-primary">{t("nav.services")}</span>
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              {t("room.additionalServicesDesc")}
            </p>
            <Link to="/servicios">
              <Button size="lg" className="font-semibold text-lg px-8">
                {t("room.exploreServices")} <ArrowRight size={18} />
              </Button>
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}