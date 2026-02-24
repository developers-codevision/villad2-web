// Admin Calendar Page - Extended calendar view of reservations
// Clean Architecture - All business logic in hooks

import { useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { useReservationManagement } from "../hooks/reservations/useReservationManagement";
import { PageHeader } from "../components/common/PageHeader";
import { EmptyState } from "../components/common/EmptyState";
import { ReservationCalendar } from "../components/reservations";
import { useAvailability } from "@/modules/shared/hooks";

export default function AdminCalendario() {
  const {
    allReservations,
    loading,
    loadReservations,
    openEdit,
  } = useReservationManagement();

  // Load occupied dates for general info
  const { occupiedDates } = useAvailability();

  // Load data on mount
  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  return (
    <div>
      {/* Page Header */}
      <PageHeader
        title="Calendario de Reservas"
        description="Vista extendida del calendario con todas las reservas, entradas y salidas."
      />

      {/* Loading State */}
      {loading && (
        <EmptyState
          icon={CalendarIcon}
          title="Cargando calendario..."
        />
      )}

      {/* Calendar - Always visible */}
      {!loading && (
        <ReservationCalendar
          reservations={allReservations}
          onReservationClick={openEdit}
          occupiedDates={occupiedDates}
        />
      )}
    </div>
  );
}
