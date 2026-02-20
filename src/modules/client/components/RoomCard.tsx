import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/button";
import { Card, CardContent } from "@/modules/shared/components/ui/card";
import { ImageWithPlaceholder } from "@/modules/shared/components";
import type { Room } from "@/modules/shared/types/api.types";
import { parseAmenities, parsePhotos } from "@/modules/client/utils/roomHelpers";
import { roomsService } from "@/modules/shared/services/rooms.service";

export default function RoomCard({ room, compact }: { room: Room; compact?: boolean }) {
  // Get the main image from mainPhoto array or use a placeholder
  const mainPhotoArray = parsePhotos(room.mainPhoto);
  const mainImage = mainPhotoArray.length > 0
    ? roomsService.getMediaUrl(mainPhotoArray[0])
    : 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop';

  // Ensure roomAmenities is always an array
  const amenities = parseAmenities(room.roomAmenities);

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <div className="relative overflow-hidden aspect-[4/3]">
        <ImageWithPlaceholder
          src={mainImage}
          alt={`Habitación #${room.number}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg">#{room.number}</h3>
          <span className="flex items-center gap-1 text-muted-foreground text-sm">
            <Users size={14} /> {room.capacity}
          </span>
        </div>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{room.description}</p>
        <div className="flex gap-2">
          <Link to={`/habitaciones/${room.id}`} className="flex-1">
            <Button variant="outline" className="w-full font-semibold" size="sm">
              Ver más
            </Button>
          </Link>
          <Link to={`/reservas?room=${room.id}`} className="flex-1">
            <Button className="w-full font-semibold" size="sm">
              Reservar
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
