// Admin Habitaciones Page - Clean Architecture
// All business logic moved to hooks, utils, and types

import { useEffect } from "react";
import { BedDouble } from "lucide-react";
import { useRoomManagement } from "../hooks/rooms/useRoomManagement";
import { PageHeader } from "../components/common/PageHeader";
import { EmptyState } from "../components/common/EmptyState";
import { DeleteConfirmDialog } from "../components/common/DeleteConfirmDialog";
import { RoomTable } from "../components/rooms/RoomTable";
import { RoomFormDialog } from "../components/rooms/RoomFormDialog";

export default function AdminHabitaciones() {
  // Use the custom hook for all business logic
  const {
    rooms,
    loading,
    formState,
    formData,
    amenityInput,
    amenityBannoInput,
    photoState,
    loadRooms,
    openCreate,
    openEdit,
    closeDialog,
    saveRoom,
    deleteRoom,
    confirmDelete,
    cancelDelete,
    updateFormField,
    setAmenityInput,
    setAmenityBannoInput,
    updateMainPhoto,
    updateAdditionalPhotos,
    setFormData,
  } = useRoomManagement();

  // Load rooms on mount
  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  return (
    <div>
      {/* Page Header */}
      <PageHeader
        title="Habitaciones"
        description="Administra las habitaciones y su disponibilidad."
        actionLabel="Nueva Habitación"
        onAction={openCreate}
      />

      {/* Loading State */}
      {loading && (
        <EmptyState
          icon={BedDouble}
          title="Cargando habitaciones..."
        />
      )}

      {/* Empty State */}
      {!loading && rooms.length === 0 && (
        <EmptyState
          icon={BedDouble}
          title="No hay habitaciones registradas"
          description="Crea la primera habitación con el botón de arriba."
        />
      )}

      {/* Room Table */}
      {!loading && rooms.length > 0 && (
        <RoomTable
          rooms={rooms}
          onEdit={openEdit}
          onDelete={deleteRoom}
          onConfirmDelete={confirmDelete}
          onCancelDelete={cancelDelete}
          deleteConfirmId={formState.deleteConfirm}
        />
      )}

      {/* Room Form Dialog */}
      <RoomFormDialog
        open={formState.open}
        isEditing={!!formState.editing}
        saving={formState.saving}
        formData={formData}
        amenityInput={amenityInput}
        amenityBannoInput={amenityBannoInput}
        onClose={closeDialog}
        onSave={saveRoom}
        onFormChange={updateFormField}
        onAmenityInputChange={setAmenityInput}
        onAmenityBannoInputChange={setAmenityBannoInput}
        onMainPhotoChange={files => updateMainPhoto(files[0] || null)}
        onAdditionalPhotosChange={updateAdditionalPhotos}
        onMainPhotoUrlsChange={urls => setFormData(prev => ({ ...prev, foto_principal: urls }))}
        onAdditionalPhotoUrlsChange={urls => setFormData(prev => ({ ...prev, fotos_adicionales: urls }))}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={formState.deleteConfirm !== null}
        title="¿Eliminar habitación?"
        onConfirm={() => formState.deleteConfirm && deleteRoom(formState.deleteConfirm)}
        onCancel={cancelDelete}
      />
    </div>
  );
}
