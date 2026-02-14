import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Room } from "@/data/hostal";

export default function RoomCard({ room, compact }: { room: Room; compact?: boolean }) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <span className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
          {room.price}€/noche
        </span>
      </div>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg">{room.name}</h3>
          <span className="flex items-center gap-1 text-muted-foreground text-sm">
            <Users size={14} /> {room.capacity}
          </span>
        </div>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{room.description}</p>
        {!compact && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {room.amenities.map((a) => (
              <span key={a} className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                {a}
              </span>
            ))}
          </div>
        )}
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
