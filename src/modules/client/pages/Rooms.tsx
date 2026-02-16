import { Navbar, Footer } from "@/modules/shared/components";
import { RoomCard } from "@/modules/client/components";
import { ROOMS } from "@/modules/shared/data/hostal";

export default function Rooms() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-3">
            Nuestras <span className="text-primary">Habitaciones</span>
          </h1>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Encuentra la habitación ideal para tu estancia. Todas incluyen WiFi gratuito y desayuno.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ROOMS.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
