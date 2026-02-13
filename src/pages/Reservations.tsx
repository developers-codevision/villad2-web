import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import { CreditCard, Smartphone, DollarSign, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ROOMS } from "@/data/hostal";
import type { DateRange } from "react-day-picker";

export default function Reservations() {
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get("room") || "";

  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [roomId, setRoomId] = useState(preselected);
  const [guests, setGuests] = useState("1");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const checkIn = dateRange?.from;
  const checkOut = dateRange?.to;
  const selectedRoom = ROOMS.find((r) => r.id === roomId);
  const nights = checkIn && checkOut ? Math.max(differenceInDays(checkOut, checkIn), 0) : 0;
  const total = selectedRoom ? nights * selectedRoom.price : 0;

  const canSubmit = checkIn && checkOut && nights > 0 && roomId && name && email && phone;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-20 px-4 flex items-center justify-center min-h-[70vh]">
          <div className="text-center max-w-md">
            <CheckCircle size={64} className="text-primary mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-3">¡Reserva Confirmada!</h1>
            <p className="text-muted-foreground mb-2">
              Gracias, <strong>{name}</strong>. Tu reserva en <strong>{selectedRoom?.name}</strong> ha sido registrada.
            </p>
            <p className="text-muted-foreground mb-1">
              {checkIn && format(checkIn, "dd MMM yyyy", { locale: es })} — {checkOut && format(checkOut, "dd MMM yyyy", { locale: es })}
            </p>
            <p className="text-2xl font-bold text-primary mt-4">{total}€ total</p>
            <p className="text-sm text-muted-foreground mt-4">
              Recibirás un email de confirmación en <strong>{email}</strong>.
            </p>
            <Button className="mt-8 font-semibold" onClick={() => setConfirmed(false)}>
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
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Selecciona tus fechas, elige la habitación y completa tus datos.
          </p>

          {/* Date range calendar - full width */}
          <div className="space-y-2 mb-8">
            <Label className="text-base">Fechas de estancia</Label>
            <div className="border border-border rounded-lg p-6 flex justify-center">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                disabled={(d) => d < new Date()}
                locale={es}
                className="pointer-events-auto"
              />
            </div>
            {checkIn && checkOut && (
              <p className="text-sm text-muted-foreground text-center">
                {format(checkIn, "dd MMM yyyy", { locale: es })} — {format(checkOut, "dd MMM yyyy", { locale: es })} · {nights} {nights === 1 ? "noche" : "noches"}
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
                  <Select value={roomId} onValueChange={setRoomId}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar habitación" /></SelectTrigger>
                    <SelectContent>
                      {ROOMS.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.name} — {r.price}€/noche
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Huéspedes</Label>
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n} {n === 1 ? "huésped" : "huéspedes"}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Guest info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Datos del Huésped</h3>
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+34 600 000 000" required />
                  </div>
                </div>
              </div>

              {/* Payment methods info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Métodos de Pago Aceptados</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="border border-border rounded-lg p-4 text-center">
                    <CreditCard size={28} className="mx-auto mb-2 text-primary" />
                    <p className="font-semibold text-sm">Tarjeta (Stripe)</p>
                    <p className="text-xs text-muted-foreground mt-1">Visa, Mastercard, Amex</p>
                  </div>
                  <div className="border border-border rounded-lg p-4 text-center">
                    <Smartphone size={28} className="mx-auto mb-2 text-primary" />
                    <p className="font-semibold text-sm">Bizum</p>
                    <p className="text-xs text-muted-foreground mt-1">Pago instantáneo móvil</p>
                  </div>
                  <div className="border border-border rounded-lg p-4 text-center">
                    <DollarSign size={28} className="mx-auto mb-2 text-primary" />
                    <p className="font-semibold text-sm">Zelle</p>
                    <p className="text-xs text-muted-foreground mt-1">Transferencia digital</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  * El pago se realizará en el momento del check-in o según instrucciones enviadas por email.
                </p>
              </div>

              <Button type="submit" size="lg" className="w-full font-bold text-lg py-6" disabled={!canSubmit}>
                Confirmar Reserva
              </Button>
            </div>

            {/* Summary sidebar */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                <h3 className="font-bold text-lg mb-4">Resumen de Reserva</h3>
                {selectedRoom ? (
                  <>
                    <img src={selectedRoom.image} alt={selectedRoom.name} className="rounded-lg w-full h-40 object-cover mb-4" loading="lazy" />
                    <p className="font-semibold">{selectedRoom.name}</p>
                    <p className="text-sm text-muted-foreground mb-4">{selectedRoom.type} · Hasta {selectedRoom.capacity} {selectedRoom.capacity === 1 ? "persona" : "personas"}</p>
                  </>
                ) : (
                  <p className="text-muted-foreground text-sm mb-4">Selecciona una habitación</p>
                )}

                <div className="border-t border-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-in</span>
                    <span>{checkIn ? format(checkIn, "dd MMM yyyy", { locale: es }) : "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-out</span>
                    <span>{checkOut ? format(checkOut, "dd MMM yyyy", { locale: es }) : "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Noches</span>
                    <span>{nights}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Huéspedes</span>
                    <span>{guests}</span>
                  </div>
                  {selectedRoom && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Precio/noche</span>
                      <span>{selectedRoom.price}€</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-border mt-4 pt-4 flex justify-between items-center">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-2xl text-primary">{total}€</span>
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
