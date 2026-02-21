// Admin Reservas Page - Clean Architecture
// All business logic moved to hooks, utils, and types

import { useEffect } from "react";
import { CalendarCheck, Plus } from "lucide-react";
import { useReservationManagement } from "../hooks/reservations/useReservationManagement";
import { useRoomManagement } from "../hooks/rooms/useRoomManagement";
import { PageHeader } from "../components/common/PageHeader";
import { EmptyState } from "../components/common/EmptyState";
import { DeleteConfirmDialog } from "../components/common/DeleteConfirmDialog";
import {
  ReservationTable,
  ReservationFormDialog,
  ReservationFilters,
  ReservationStats,
} from "../components/reservations";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/modules/shared/components/ui/alert-dialog";
import { RESERVATION_STATUS_LABELS } from "../types/reservations.types";

export default function AdminReservas() {
  // Use the custom hook for all business logic
  const {
    reservations,
    allReservations,
    loading,
    formState,
    formData,
    filterState,
    loadReservations,
    openCreate,
    openEdit,
    closeDialog,
    saveReservation,
    deleteReservation,
    confirmDelete,
    cancelDelete,
    updateFormField,
    requestStatusChange,
    confirmStatusChange,
    cancelStatusChange,
    updateFilter,
    clearFilters,
    setFormData,
  } = useReservationManagement();

  // Load available rooms for the form
  const { rooms, loadRooms } = useRoomManagement();

  // Load data on mount
  useEffect(() => {
    loadReservations();
    loadRooms();
  }, [loadReservations, loadRooms]);

  return (
    <div>
      {/* Page Header */}
      <PageHeader
        title="Reservas"
        description="Gestiona las reservas del hostal y crea reservas manuales."
        actionLabel="Nueva Reserva Manual"
        actionIcon={Plus}
        onAction={openCreate}
      />

      {/* Stats */}
      {!loading && allReservations.length > 0 && (
        <div className="mb-6">
          <ReservationStats reservations={allReservations} />
        </div>
      )}

      {/* Filters */}
      {!loading && allReservations.length > 0 && (
        <div className="mb-6">
          <ReservationFilters
            filters={filterState}
            onFilterChange={updateFilter}
            onClearFilters={clearFilters}
          />
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <EmptyState
          icon={CalendarCheck}
          title="Cargando reservas..."
        />
      )}

      {/* Empty State */}
      {!loading && allReservations.length === 0 && (
        <EmptyState
          icon={CalendarCheck}
          title="No hay reservas registradas"
          description="Las nuevas reservas de clientes aparecerán aquí. También puedes crear reservas manualmente."
        />
      )}

      {/* No Results State (after filtering) */}
      {!loading && allReservations.length > 0 && reservations.length === 0 && (
        <EmptyState
          icon={CalendarCheck}
          title="No se encontraron reservas"
          description="Intenta ajustar los filtros de búsqueda."
        />
      )}

      {/* Reservation Table */}
      {!loading && reservations.length > 0 && (
        <ReservationTable
          reservations={reservations}
          onEdit={openEdit}
          onDelete={confirmDelete}
          onStatusChange={requestStatusChange}
        />
      )}

      {/* Reservation Form Dialog */}
      <ReservationFormDialog
        open={formState.open}
        isEditing={!!formState.editing}
        saving={formState.saving}
        formData={formData}
        availableRooms={rooms}
        onClose={closeDialog}
        onSave={saveReservation}
        onFormChange={updateFormField}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={formState.deleteConfirm !== null}
        title="¿Eliminar reserva?"
        description="Esta acción no se puede deshacer. La reserva será eliminada permanentemente."
        onConfirm={() => formState.deleteConfirm && deleteReservation(formState.deleteConfirm)}
        onCancel={cancelDelete}
      />

      {/* Status Change Confirmation Dialog */}
      <AlertDialog
        open={formState.statusChangeConfirm !== null}
        onOpenChange={open => !open && cancelStatusChange()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cambiar estado de la reserva?</AlertDialogTitle>
            <AlertDialogDescription>
              {formState.statusChangeConfirm && (
                <>
                  Esta reserva cambiará a estado:{" "}
                  <strong>
                    {RESERVATION_STATUS_LABELS[formState.statusChangeConfirm.newStatus]}
                  </strong>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelStatusChange}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusChange}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

