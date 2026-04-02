import { Navbar, Footer } from "@/modules/shared/components";
import { RoomCard, RoomCardSkeleton } from "@/modules/client/components";
import { useRooms } from "@/modules/client/hooks/useRooms";
import { useLanguage } from "@/modules/client/contexts";

export default function Rooms() {
  const { availableRooms, loading, error } = useRooms();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-3">
            {t("rooms.title")}
          </h1>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            {t("rooms.subtitle")}
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
              <p className="text-muted-foreground">
                {t("rooms.error")}
              </p>
            </div>
          )}

          {!loading && !error && availableRooms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {t("rooms.noRooms")}
              </p>
            </div>
          )}

          {!loading && !error && availableRooms.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {availableRooms.map((room) => (
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
