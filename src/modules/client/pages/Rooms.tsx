import { Navbar, Footer } from "@/modules/shared/components";
import { RoomCard, RoomCardSkeleton } from "@/modules/client/components";
import { useRooms } from "@/modules/client/hooks/useRooms";

export default function Rooms() {
  const { rooms, loading, error } = useRooms();

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

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <RoomCardSkeleton key={i} />
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">{error}</p>
              <p className="text-muted-foreground">Por favor, intenta nuevamente más tarde.</p>
            </div>
          )}

          {!loading && !error && rooms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hay habitaciones disponibles en este momento.</p>
            </div>
          )}

          {!loading && !error && rooms.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
