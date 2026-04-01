// Admin Reservations Hook - Business logic for reservation management

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { ReservationStatus } from '@/modules/shared/types/api.types';
import { reservationsService } from '@/modules/shared/services';
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

  normalizeReservation,
} from '../../utils/reservations.utils';

import {  filterReservationsByStatus,
  filterReservationsByDateRange,
  filterReservationsBySearch,
  sortReservationsByDate }  from '../../../shared/utils/reservations.utils.ts';
import { useAvailability } from '@/modules/shared/hooks';

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

  // Availability
  const { occupiedDates } = useAvailability(formData.roomId);

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
      const data = await reservationsService.getAll();
      // Normalize reservations to ensure consistent format
      const normalized = data.map(normalizeReservation);
      setReservations(normalized);
    } catch (error) {
      console.error('Error loading reservations:', error);
      toast.error('Error al cargar las reservas');
      setReservations([]);
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

  // Load data on mount
  useEffect(() => {
    loadReservations();
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
    const validation = validateReservationForm(formData, 'admin'); // Pass admin explicitly to match types
    if (!validation.valid) {
      const hasPhoneFormatError = validation.errors.some(error =>
        error.includes('formato internacional válido') || error.includes('+51 987 654 321')
      );

      if (hasPhoneFormatError) {
        toast.error('Por favor, ingrese un número de teléfono válido en formato internacional (incluyendo el "+").');
      }

      validation.errors.forEach(error => {
         if (!error.includes('formato internacional válido') && !error.includes('+51 987 654 321')) {
             toast.error(error);
         }
      });
      return;
    }

    setFormState(prev => ({ ...prev, saving: true }));

    try {
      if (formState.editing) {
        // Update existing reservation
        const updateDto = formDataToUpdateDto(formData);
        await reservationsService.update(formState.editing.id, updateDto);
        toast.success('Reserva actualizada correctamente');
      } else {
        // Create new reservation
        const createDto = formDataToCreateDto(formData);
        await reservationsService.create(createDto);
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
      await reservationsService.delete(id);
      toast.success('Reserva eliminada correctamente');
      setFormState(prev => ({ ...prev, deleteConfirm: null }));
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
      await reservationsService.update(id, { status: newStatus });
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

  // --- canSubmit: validación centralizada ---
  // Allow submitting so we can show validation errors (like phone format) on click
  const canSubmit = !formState.saving;

  return {
    // State
    reservations: filteredReservations(),
    allReservations: reservations,
    loading,
    formState,
    formData,
    filterState,
    occupiedDates,

    // Computed
    canSubmit,

    // Data loading
    loadReservations,
    reloadReservations,

    // Form management
    openCreate,
    openEdit,
    closeDialog,
    saveReservation,
    deleteReservation,
    confirmDelete,
    cancelDelete,
    updateFormField,

    // Status change
    requestStatusChange,
    confirmStatusChange,
    cancelStatusChange,

    // Filters
    updateFilter,
    clearFilters,
  };
}
