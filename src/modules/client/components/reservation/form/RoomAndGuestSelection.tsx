import { Label } from '@/modules/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/modules/shared/components/ui/select';
import type { Room } from '@/modules/shared/types/api.types';

interface RoomAndGuestSelectionProps {
  selectedRoomId: number | undefined;
  rooms: Room[];
  loadingRooms: boolean;
  singleRoomId?: number;
  totalGuests: number;
  maxCapacity: number;
  onRoomSelect: (roomId: number) => void;
  onTotalGuestsChange: (total: number) => void;
}

export default function RoomAndGuestSelection({
  selectedRoomId,
  rooms,
  loadingRooms,
  singleRoomId,
  totalGuests,
  maxCapacity,
  onRoomSelect,
  onTotalGuestsChange,
}: RoomAndGuestSelectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Habitación</Label>
        <Select
          value={selectedRoomId?.toString() || ''}
          onValueChange={(value) => onRoomSelect(parseInt(value))}
          disabled={loadingRooms || !!singleRoomId}
        >
          <SelectTrigger>
            <SelectValue placeholder={loadingRooms ? "Cargando..." : "Seleccionar habitación"} />
          </SelectTrigger>
          <SelectContent>
            {rooms.map((r) => (
              <SelectItem key={r.id} value={r.id.toString()}>
                {r.name} : ${r.pricePerNight}/noche
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Huéspedes Totales</Label>
        <Select
          value={totalGuests.toString()}
          onValueChange={(value) => onTotalGuestsChange(parseInt(value))}
          disabled={!selectedRoomId}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
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
  );
}

