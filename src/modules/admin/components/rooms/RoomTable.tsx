// Room Table Component - Displays list of rooms

import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/modules/shared/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/modules/shared/components/ui/table';
import { Room } from '@/modules/shared/types/api.types';
import { RoomStatusBadge } from './RoomStatusBadge';
import { parsePhotos } from '@/modules/client/utils/roomHelpers';
import { getImageUrl } from '../../utils/rooms.utils';
import { ROOM_TYPE_LABELS } from '../../types/rooms.types';

interface RoomTableProps {
  rooms: Room[];
  onEdit: (room: Room) => void;
  onDelete: (id: number) => void;
  onConfirmDelete: (id: number) => void;
  onCancelDelete: () => void;
  deleteConfirmId: number | null;
}

export function RoomTable({
  rooms,
  onEdit,
  onDelete,
  onConfirmDelete,
  onCancelDelete,
  deleteConfirmId
}: RoomTableProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nº</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Precio/noche</TableHead>
            <TableHead className="text-center">Capacidad</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms.map(room => {
            const mainPhotoArray = parsePhotos(room.mainPhoto);
            return (
              <TableRow key={room.id}>
                <TableCell className="font-mono font-semibold">{room.number}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {mainPhotoArray.length > 0 && (
                      <img
                        src={getImageUrl(mainPhotoArray[0])}
                        alt={room.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                    )}
                    <span className="font-medium">{room.name}</span>
                  </div>
                </TableCell>
                <TableCell className="capitalize">{ROOM_TYPE_LABELS[room.roomType] || room.roomType}</TableCell>
                <TableCell className="text-right">{room.pricePerNight}$</TableCell>
                <TableCell className="text-center">{room.capacity}</TableCell>
                <TableCell>
                  <RoomStatusBadge status={room.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(room)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {deleteConfirmId === room.id ? (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(room.id)}
                        >
                          Sí
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={onCancelDelete}
                        >
                          No
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onConfirmDelete(room.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
