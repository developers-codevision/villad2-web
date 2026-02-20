// Room Status Badge Component

import { Badge } from '@/modules/shared/components/ui/badge';
import { RoomStatus } from '@/modules/shared/types/api.types';
import { ROOM_STATUS_LABELS, ROOM_STATUS_VARIANTS } from '../../types/rooms.types';

interface RoomStatusBadgeProps {
  status: RoomStatus;
}

export function RoomStatusBadge({ status }: RoomStatusBadgeProps) {
  return (
    <Badge variant={ROOM_STATUS_VARIANTS[status]}>
      {ROOM_STATUS_LABELS[status]}
    </Badge>
  );
}

