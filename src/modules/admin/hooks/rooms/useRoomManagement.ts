// Admin Rooms Hook - Business logic separated from UI

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { roomsService } from '@/modules/shared/services';
import { Room } from '@/modules/shared/types/api.types';
import {
  RoomFormData,
  RoomPhotoState,
  RoomFormState
} from '../../types/rooms.types';
import {
  roomToFormData,
  formDataToCreateDto,
  formDataToUpdateDto,
  calculateKeptPhotos,
  amenitiesToString,
  getImageUrl,
  validateRoomForm,
  createEmptyFormData,
} from '../../utils/rooms.utils';

/**
 * Custom hook for managing room list and CRUD operations
 */
export function useRoomManagement() {
  // List state
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formState, setFormState] = useState<RoomFormState>({
    open: false,
    editing: null,
    saving: false,
    deleteConfirm: null,
  });

  // Form data
  const [formData, setFormData] = useState<RoomFormData>(createEmptyFormData());
  const [amenityInput, setAmenityInput] = useState('');
  const [amenityBannoInput, setAmenityBannoInput] = useState('');

  // Photo state
  const [photoState, setPhotoState] = useState<RoomPhotoState>({
    mainPhotoFile: null,
    additionalPhotoFiles: [],
    originalMainPhoto: [],
    originalAdditionalPhotos: [],
  });

  /**
   * Load all rooms from API
   */
  const loadRooms = useCallback(async () => {
    try {
      setLoading(true);
      const data = await roomsService.getAll();
      setRooms(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al cargar habitaciones';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Open create dialog
   */
  const openCreate = useCallback(() => {
    setFormState({
      open: true,
      editing: null,
      saving: false,
      deleteConfirm: null,
    });
    setFormData(createEmptyFormData());
    setAmenityInput('');
    setAmenityBannoInput('');
    setPhotoState({
      mainPhotoFile: null,
      additionalPhotoFiles: [],
      originalMainPhoto: [],
      originalAdditionalPhotos: [],
    });
  }, []);

  /**
   * Open edit dialog
   */
  const openEdit = useCallback((room: Room) => {
    setFormState(prev => ({
      ...prev,
      open: true,
      editing: room,
    }));

    // Store original photo paths
    setPhotoState({
      mainPhotoFile: null,
      additionalPhotoFiles: [],
      originalMainPhoto: room.mainPhoto || [],
      originalAdditionalPhotos: room.additionalPhotos || [],
    });

    // Convert room to form data
    setFormData(roomToFormData(room, getImageUrl));
    setAmenityInput(amenitiesToString(room.roomAmenities));
    setAmenityBannoInput(amenitiesToString(room.bathroomAmenities));
  }, []);

  /**
   * Close dialog
   */
  const closeDialog = useCallback(() => {
    setFormState(prev => ({ ...prev, open: false }));
  }, []);

  /**
   * Save room (create or update)
   */
  const saveRoom = useCallback(async () => {
    // Validate form
    const validation = validateRoomForm(formData);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setFormState(prev => ({ ...prev, saving: true }));

    try {
      if (formState.editing) {
        // Update existing room
        const keepPhotos = calculateKeptPhotos(formData, photoState, getImageUrl);
        const updateDto = formDataToUpdateDto(formData, amenityInput, amenityBannoInput);

        const updatedRoom = await roomsService.update(
          formState.editing.id,
          updateDto,
          photoState.mainPhotoFile || undefined,
          photoState.additionalPhotoFiles.length > 0 ? photoState.additionalPhotoFiles : undefined,
          keepPhotos.length > 0 ? keepPhotos : undefined
        );

        setRooms(prev => prev.map(r => r.id === formState.editing!.id ? updatedRoom : r));
        toast.success('Habitación actualizada correctamente');
      } else {
        // Create new room
        const createDto = formDataToCreateDto(formData, amenityInput, amenityBannoInput);

        const newRoom = await roomsService.create(
          createDto,
          photoState.mainPhotoFile || undefined,
          photoState.additionalPhotoFiles.length > 0 ? photoState.additionalPhotoFiles : undefined
        );

        setRooms(prev => [...prev, newRoom]);
        toast.success('Habitación creada correctamente');
      }

      setFormState(prev => ({ ...prev, open: false, saving: false }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al guardar habitación';
      toast.error(message);
      setFormState(prev => ({ ...prev, saving: false }));
    }
  }, [formData, formState.editing, photoState, amenityInput, amenityBannoInput]);

  /**
   * Delete room
   */
  const deleteRoom = useCallback(async (id: number) => {
    try {
      await roomsService.delete(id);
      setRooms(prev => prev.filter(r => r.id !== id));
      setFormState(prev => ({ ...prev, deleteConfirm: null }));
      toast.success('Habitación eliminada correctamente');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al eliminar habitación';
      toast.error(message);
    }
  }, []);

  /**
   * Confirm delete
   */
  const confirmDelete = useCallback((id: number) => {
    setFormState(prev => ({ ...prev, deleteConfirm: id }));
  }, []);

  /**
   * Cancel delete
   */
  const cancelDelete = useCallback(() => {
    setFormState(prev => ({ ...prev, deleteConfirm: null }));
  }, []);

  /**
   * Update form field
   */
  const updateFormField = useCallback(<K extends keyof RoomFormData>(
    field: K,
    value: RoomFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  /**
   * Update photo files
   */
  const updateMainPhoto = useCallback((file: File | null) => {
    setPhotoState(prev => ({ ...prev, mainPhotoFile: file }));
  }, []);

  const updateAdditionalPhotos = useCallback((files: File[]) => {
    setPhotoState(prev => ({ ...prev, additionalPhotoFiles: files }));
  }, []);

  return {
    // State
    rooms,
    loading,
    formState,
    formData,
    amenityInput,
    amenityBannoInput,
    photoState,

    // Actions
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
  };
}

