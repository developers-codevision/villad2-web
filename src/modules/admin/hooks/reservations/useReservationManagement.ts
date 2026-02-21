// Admin Reservations Hook - Business logic for reservation management

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { ReservationStatus } from '@/modules/shared/types/api.types';
import {
  ReservationFormData,
  ReservationWithDetails,
  ReservationFormState,
  ReservationFilterState,
} from '../../types/reservations.types';
import {
  createEmptyReservationForm,
  reservationToFormData,
  formDataToCreateDto,
  formDataToUpdateDto,
  validateReservationForm,
  filterReservationsByStatus,
  filterReservationsByDateRange,
  filterReservationsBySearch,
  sortReservationsByDate,
  calculateTotalPrice,
} from '../../utils/reservations.utils';

/**
 * Custom hook for managing reservations in admin panel
 * Handles CRUD operations, filtering, and status changes
 */
export function useReservationManagement() {
  // List state
  const [reservations, setReservations] = useState<ReservationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formState, setFormState] = useState<ReservationFormState>({
    open: false,
    editing: null,
    saving: false,
    deleteConfirm: null,
    statusChangeConfirm: null,
  });

  // Form data
  const [formData, setFormData] = useState<ReservationFormData>(
    createEmptyReservationForm()
  );

  // Filter state
  const [filterState, setFilterState] = useState<ReservationFilterState>({
    status: 'all',
    dateFrom: undefined,
    dateTo: undefined,
    searchQuery: '',
  });

  // ============================================
  // COMPUTED VALUES
  // ============================================

  /**
   * Get filtered and sorted reservations
   */
  const filteredReservations = useCallback(() => {
    let result = [...reservations];

    // Apply status filter
    result = filterReservationsByStatus(result, filterState.status);

    // Apply date range filter
    result = filterReservationsByDateRange(
      result,
      filterState.dateFrom,
      filterState.dateTo
    );

    // Apply search filter
    result = filterReservationsBySearch(result, filterState.searchQuery);

    // Sort by date (newest first)
    result = sortReservationsByDate(result, false);

    return result;
  }, [reservations, filterState]);

  // ============================================
  // DATA LOADING
  // ============================================

  /**
   * Load all reservations from API
   */
  const loadReservations = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const data = await reservationsService.getAll();
      // setReservations(data);

      // Mock data for now
      await new Promise(resolve => setTimeout(resolve, 500));
      setReservations([]);

    } catch (error) {
      console.error('Error loading reservations:', error);
      toast.error('Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reload reservations (useful after CRUD operations)
   */
  const reloadReservations = useCallback(() => {
    return loadReservations();
  }, [loadReservations]);

  // ============================================
  // FORM MANAGEMENT
  // ============================================

  /**
   * Open dialog to create new reservation
   */
  const openCreate = useCallback(() => {
    setFormData(createEmptyReservationForm());
    setFormState({
      open: true,
      editing: null,
      saving: false,
      deleteConfirm: null,
      statusChangeConfirm: null,
    });
  }, []);

  /**
   * Open dialog to edit existing reservation
   */
  const openEdit = useCallback((reservation: ReservationWithDetails) => {
    setFormData(reservationToFormData(reservation));
    setFormState({
      open: true,
      editing: reservation,
      saving: false,
      deleteConfirm: null,
      statusChangeConfirm: null,
    });
  }, []);

  /**
   * Close form dialog
   */
  const closeDialog = useCallback(() => {
    setFormState(prev => ({ ...prev, open: false }));
    setTimeout(() => {
      setFormData(createEmptyReservationForm());
      setFormState({
        open: false,
        editing: null,
        saving: false,
        deleteConfirm: null,
        statusChangeConfirm: null,
      });
    }, 200);
  }, []);

  /**
   * Update form field
   */
  const updateFormField = useCallback(
    <K extends keyof ReservationFormData>(
      field: K,
      value: ReservationFormData[K]
    ) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    },
    []
  );

  // ============================================
  // CRUD OPERATIONS
  // ============================================

  /**
   * Save reservation (create or update)
   */
  const saveReservation = useCallback(async () => {
    // Validate form
    const validation = validateReservationForm(formData);
    if (!validation.valid) {
      validation.errors.forEach(error => toast.error(error));
      return;
    }

    setFormState(prev => ({ ...prev, saving: true }));

    try {
      if (formState.editing) {
        // Update existing reservation
        const updateDto = formDataToUpdateDto(formData);

        // TODO: Replace with actual API call
        // await reservationsService.update(formState.editing.id, updateDto);

        toast.success('Reserva actualizada correctamente');
      } else {
        // Create new reservation
        // Calculate total price (you'll need to get room price)
        const roomPrice = 100; // TODO: Get from selected room
        const totalPrice = formData.checkIn && formData.checkOut
          ? calculateTotalPrice(roomPrice, formData.checkIn, formData.checkOut)
          : 0;

        const createDto = formDataToCreateDto(formData, totalPrice);

        // TODO: Replace with actual API call
        // await reservationsService.create(createDto);

        toast.success('Reserva creada correctamente');
      }

      closeDialog();
      await reloadReservations();
    } catch (error) {
      console.error('Error saving reservation:', error);
      toast.error('Error al guardar la reserva');
    } finally {
      setFormState(prev => ({ ...prev, saving: false }));
    }
  }, [formData, formState.editing, closeDialog, reloadReservations]);

  /**
   * Delete reservation
   */
  const deleteReservation = useCallback(async (id: number) => {
    try {
      // TODO: Replace with actual API call
      // await reservationsService.delete(id);

      toast.success('Reserva eliminada correctamente');
      await reloadReservations();
    } catch (error) {
      console.error('Error deleting reservation:', error);
      toast.error('Error al eliminar la reserva');
    }
  }, [reloadReservations]);

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

  // ============================================
  // STATUS MANAGEMENT
  // ============================================

  /**
   * Request status change
   */
  const requestStatusChange = useCallback(
    (id: number, newStatus: ReservationStatus) => {
      setFormState(prev => ({
        ...prev,
        statusChangeConfirm: { id, newStatus },
      }));
    },
    []
  );

  /**
   * Confirm status change
   */
  const confirmStatusChange = useCallback(async () => {
    if (!formState.statusChangeConfirm) return;

    const { id, newStatus } = formState.statusChangeConfirm;

    try {
      // TODO: Replace with actual API call
      // await reservationsService.updateStatus(id, newStatus);

      toast.success('Estado actualizado correctamente');
      await reloadReservations();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error al actualizar el estado');
    } finally {
      setFormState(prev => ({ ...prev, statusChangeConfirm: null }));
    }
  }, [formState.statusChangeConfirm, reloadReservations]);

  /**
   * Cancel status change
   */
  const cancelStatusChange = useCallback(() => {
    setFormState(prev => ({ ...prev, statusChangeConfirm: null }));
  }, []);

  // ============================================
  // FILTER MANAGEMENT
  // ============================================

  /**
   * Update filter field
   */
  const updateFilter = useCallback(
    <K extends keyof ReservationFilterState>(
      field: K,
      value: ReservationFilterState[K]
    ) => {
      setFilterState(prev => ({ ...prev, [field]: value }));
    },
    []
  );

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setFilterState({
      status: 'all',
      dateFrom: undefined,
      dateTo: undefined,
      searchQuery: '',
    });
  }, []);

  // ============================================
  // RETURN
  // ============================================

  return {
    // State
    reservations: filteredReservations(),
    allReservations: reservations,
    loading,
    formState,
    formData,
    filterState,

    // Data operations
    loadReservations,
    reloadReservations,

    // Form management
    openCreate,
    openEdit,
    closeDialog,
    updateFormField,
    setFormData,

    // CRUD operations
    saveReservation,
    deleteReservation,
    confirmDelete,
    cancelDelete,

    // Status management
    requestStatusChange,
    confirmStatusChange,
    cancelStatusChange,

    // Filter management
    updateFilter,
    clearFilters,
  };
}

