// Admin Components - Centralized exports

// Common components (reusable across all admin modules)
export { PageHeader } from './common/PageHeader';
export { EmptyState } from './common/EmptyState';
export { DeleteConfirmDialog } from './common/DeleteConfirmDialog';

// Room-specific components
export { RoomTable } from './rooms/RoomTable';
export { RoomFormDialog } from './rooms/RoomFormDialog';
export { RoomStatusBadge } from './rooms/RoomStatusBadge';

// Reservation-specific components
export { ReservationTable } from './reservations/ReservationTable';
export { ReservationFormDialog } from './reservations/ReservationFormDialog';
export { ReservationFilters } from './reservations/ReservationFilters';
export { ReservationStats } from './reservations/ReservationStats';
export { ReservationCalendar } from './reservations/ReservationCalendar';
