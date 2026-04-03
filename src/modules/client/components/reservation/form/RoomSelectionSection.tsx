import { Label } from '@/modules/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/modules/shared/components/ui/select';
import type { Room } from '@/modules/shared/types/api.types';
import { getErrorClassName } from '../utils';

interface RoomSelectionSectionProps {
  roomId: number | undefined;
  rooms: Room[];
  loadingRooms?: boolean;
  disabled?: boolean;
  onRoomSelect: (roomId: number) => void;
  validationErrors?: string[];
}

export default function RoomSelectionSection({
  roomId,
  rooms,
  loadingRooms = false,
  disabled = false,
  onRoomSelect,
  validationErrors = [],
}: RoomSelectionSectionProps) {
  return (
    <div className="space-y-2">
      <Label>Habitación</Label>
      <Select
        value={roomId?.toString() || ''}
        onValueChange={(value) => onRoomSelect(parseInt(value))}
        disabled={loadingRooms || disabled}
      >
        <SelectTrigger className={getErrorClassName('habitación', validationErrors)}>
          <SelectValue placeholder={loadingRooms ? "Cargando..." : "Seleccionar habitación"} />
        </SelectTrigger>
        <SelectContent>
          {rooms.map((r) => (
            <SelectItem key={r.id} value={r.id.toString()}>
              #{r.number} : {r.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

