// Admin Reservas Page - Clean Architecture
// All business logic moved to hooks, utils, and types

import { useEffect, useState } from "react";
import { CalendarCheck, Plus, Calendar as CalendarIcon, List } from "lucide-react";
import { useReservationManagement } from "../hooks/reservations/useReservationManagement";
import { useRoomManagement } from "../hooks/rooms/useRoomManagement";
import { PageHeader } from "../components/common/PageHeader";
import { EmptyState } from "../components/common/EmptyState";
import { DeleteConfirmDialog } from "../components/common/DeleteConfirmDialog";
import { Button } from "@/modules/shared/components/ui/button";
import {
  ReservationTable,
  ReservationFormDialog,
  ReservationFilters,
  ReservationStats,
  ReservationCalendar,
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
  // View mode state
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Use the custom hook for all business logic
  const {
    reservations,
    allReservations,
    loading,
    formState,
    formData,
    filterState,
    occupiedDates,
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
    canSubmit,
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
      {/* Page Header with View Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Reservas</h1>
          <p className="text-muted-foreground">
            Gestiona las reservas del hostal y crea reservas manuales.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="gap-2"
            >
              <List size={16} />
              Lista
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('calendar')}
              className="gap-2"
            >
              <CalendarIcon size={16} />
              Calendario
            </Button>
          </div>

          {/* Create Button */}
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Reserva
          </Button>
        </div>
      </div>

      {/* Stats */}
      {!loading && allReservations.length > 0 && (
        <div className="mb-6">
          <ReservationStats reservations={allReservations} />
        </div>
      )}

      {/* Filters (only in list view) */}
      {!loading && allReservations.length > 0 && viewMode === 'list' && (
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

      {/* No Results State (after filtering - only in list view) */}
      {!loading && allReservations.length > 0 && reservations.length === 0 && viewMode === 'list' && (
        <EmptyState
          icon={CalendarCheck}
          title="No se encontraron reservas"
          description="Intenta ajustar los filtros de búsqueda."
        />
      )}

      {/* List View */}
      {!loading && reservations.length > 0 && viewMode === 'list' && (
        <ReservationTable
          reservations={reservations}
          onEdit={openEdit}
          onDelete={confirmDelete}
          onStatusChange={requestStatusChange}
        />
      )}

      {/* Calendar View - Always visible when in calendar mode */}
      {!loading && viewMode === 'calendar' && (
        <ReservationCalendar
          reservations={allReservations}
          onReservationClick={openEdit}
          occupiedDates={occupiedDates}
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
        canSubmit={canSubmit}
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
