// Admin Promotions Hook - Business logic for promotion management

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { promotionsService, getMediaUrl } from '@/modules/shared/services';
import {
  Promotion,
  PromotionStatus,
} from '@/modules/shared/types/api.types';

export interface PromotionFormData {
  title: string;
  description: string;
  maxPeople: number;
  minPeople: number;
  time: string;
  services: string[];
  checkInTime: string;
  checkOutTime: string;
  photo: File | null;
  photoPreview: string;
  status: PromotionStatus;
}

export interface PromotionFormState {
  open: boolean;
  editing: Promotion | null;
  saving: boolean;
  deleteConfirm: number | null;
}

/**
 * Custom hook for managing promotions in admin panel
 * Handles CRUD operations and status changes
 */
export function usePromotionManagement() {
  // List state
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<PromotionStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Form state
  const [formState, setFormState] = useState<PromotionFormState>({
    open: false,
    editing: null,
    saving: false,
    deleteConfirm: null,
  });

  // Form data
  const [formData, setFormData] = useState<PromotionFormData>({
    title: '',
    description: '',
    maxPeople: 0,
    minPeople: 0,
    time: '',
    services: [],
    checkInTime: '',
    checkOutTime: '',
    photo: null,
    photoPreview: '',
    status: PromotionStatus.ACTIVE,
  });

  // ============================================
  // DATA LOADING
  // ============================================

  /**
   * Load all promotions from API
   */
  const loadPromotions = useCallback(async () => {
    setLoading(true);
    try {
      const status =
        statusFilter === 'all' ? undefined : (statusFilter as PromotionStatus);
      const response = await promotionsService.getAll(
        status,
        currentPage,
        limit
      );
      setPromotions(response.promotions);
      setTotalPages(Math.ceil(response.total / limit));
    } catch (error) {
      console.error('Error loading promotions:', error);
      toast.error('Error al cargar las promociones');
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, currentPage]);

  useEffect(() => {
    loadPromotions();
  }, [loadPromotions]);

  // ============================================
  // FORM HANDLERS
  // ============================================

  /**
   * Open create form
   */
  const openCreate = useCallback(() => {
    setFormState((prev) => ({ ...prev, open: true, editing: null }));
    setFormData({
      title: '',
      description: '',
      maxPeople: 0,
      minPeople: 0,
      time: '', // will be computed from checkInTime/checkOutTime before save
      services: [],
      checkInTime: '',
      checkOutTime: '',
      photo: null,
      photoPreview: '',
      status: PromotionStatus.ACTIVE,
    });
  }, []);

  /**
   * Open edit form with promotion data
   */
  const openEdit = useCallback((promotion: Promotion) => {
    setFormState((prev) => ({ ...prev, open: true, editing: promotion }));
    setFormData({
      title: promotion.title,
      description: promotion.description || '',
      maxPeople: promotion.maxPeople || 0,
      minPeople: promotion.minPeople || 0,
      time: promotion.time || '', // keep existing value but user won't edit it
      services: promotion.services || [],
      checkInTime: promotion.checkInTime || '',
      checkOutTime: promotion.checkOutTime || '',
      photo: null,
      photoPreview: promotion.photo ? getMediaUrl(promotion.photo) : '',
      status: promotion.status,
    });
  }, []);

  /**
   * Close form dialog
   */
  const closeForm = useCallback(() => {
    setFormState((prev) => ({ ...prev, open: false }));
    setFormData({
      title: '',
      description: '',
      maxPeople: 0,
      minPeople: 0,
      time: '',
      services: [],
      checkInTime: '',
      checkOutTime: '',
      photo: null,
      photoPreview: '',
      status: PromotionStatus.ACTIVE,
    });
  }, []);

  /**
   * Handle form field changes
   */
  const handleFormChange = useCallback(
    (field: keyof PromotionFormData, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  /**
   * Handle photo selection
   */
  const handlePhotoChange = useCallback(
    (file: File | null) => {
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFormData((prev) => ({
            ...prev,
            photo: file,
            photoPreview: e.target?.result as string,
          }));
        };
        reader.readAsDataURL(file);
      } else {
        setFormData((prev) => ({
          ...prev,
          photo: null,
          photoPreview: formState.editing?.photo || '',
        }));
      }
    },
    [formState.editing]
  );

  /**
   * Validate form data
   */
  const validateForm = useCallback((): boolean => {
    if (!formData.title.trim()) {
      toast.error('El título es obligatorio');
      return false;
    }

    if (formData.minPeople < 0 || formData.maxPeople < 0) {
      toast.error('El número de personas no puede ser negativo');
      return false;
    }

    if (formData.minPeople > formData.maxPeople && formData.maxPeople > 0) {
      toast.error('El mínimo no puede ser mayor que el máximo');
      return false;
    }

    return true;
  }, [formData.title, formData.minPeople, formData.maxPeople]);

  /**
   * Save promotion (create or update)
   */
  const savePromotion = useCallback(async () => {
    if (!validateForm()) return;

    setFormState((prev) => ({ ...prev, saving: true }));

    try {
      const formDataObj = new FormData();
      formDataObj.append('title', formData.title);
      formDataObj.append('description', formData.description);
      if (formData.maxPeople > 0)
        formDataObj.append('maxPeople', formData.maxPeople.toString());
      if (formData.minPeople > 0)
        formDataObj.append('minPeople', formData.minPeople.toString());
      // Compute duration (time) automatically from checkInTime and checkOutTime
      const computeDuration = (inTime: string, outTime: string) => {
        // Expect times as HH:MM
        if (!inTime || !outTime) return '';
        const [inH, inM] = inTime.split(':').map((s) => parseInt(s, 10));
        const [outH, outM] = outTime.split(':').map((s) => parseInt(s, 10));
        if (Number.isNaN(inH) || Number.isNaN(inM) || Number.isNaN(outH) || Number.isNaN(outM)) return '';

        // Convert to minutes since midnight
        const inTotal = inH * 60 + inM;
        const outTotal = outH * 60 + outM;

        // If out <= in, assume next day
        let diff = outTotal - inTotal;
        if (diff <= 0) diff += 24 * 60;

        const hours = Math.floor(diff / 60);
        const minutes = diff % 60;
        if (minutes === 0) return `${hours}h`;
        return `${hours}h ${minutes}m`;
      };

      const duration = computeDuration(formData.checkInTime, formData.checkOutTime);
      if (duration) formDataObj.append('time', duration);
      if (formData.services && formData.services.length > 0)
        formDataObj.append('services', JSON.stringify(formData.services));
      if (formData.checkInTime)
        formDataObj.append('checkInTime', formData.checkInTime);
      if (formData.checkOutTime)
        formDataObj.append('checkOutTime', formData.checkOutTime);
      // Don't include status in update - use changeStatus endpoint instead
      if (formData.photo) formDataObj.append('photo', formData.photo);

      if (formState.editing) {
        // Update
        await promotionsService.update(formState.editing.id, formDataObj);
        // If status changed, update it separately
        if (formState.editing.status !== formData.status) {
          await promotionsService.changeStatus(formState.editing.id, formData.status);
        }
        toast.success('Promoción actualizada correctamente');
      } else {
        // Create - include status for creation
        formDataObj.append('status', formData.status);
        await promotionsService.create(formDataObj);
        toast.success('Promoción creada correctamente');
      }

      closeForm();
      await loadPromotions();
    } catch (error) {
      console.error('Error saving promotion:', error);
      toast.error(
        formState.editing
          ? 'Error al actualizar la promoción'
          : 'Error al crear la promoción'
      );
    } finally {
      setFormState((prev) => ({ ...prev, saving: false }));
    }
  }, [formData, formState.editing, validateForm, closeForm, loadPromotions]);

  /**
   * Delete promotion
   */
  const deletePromotionHandler = useCallback(async (id: number) => {
    setFormState((prev) => ({ ...prev, deleteConfirm: null, saving: true }));

    try {
      await promotionsService.delete(id);
      toast.success('Promoción eliminada correctamente');
      await loadPromotions();
    } catch (error) {
      console.error('Error deleting promotion:', error);
      toast.error('Error al eliminar la promoción');
    } finally {
      setFormState((prev) => ({ ...prev, saving: false }));
    }
  }, [loadPromotions]);

  /**
   * Toggle promotion status
   */
  const toggleStatus = useCallback(
    async (promotion: Promotion) => {
      try {
        const newStatus =
          promotion.status === PromotionStatus.ACTIVE
            ? PromotionStatus.INACTIVE
            : PromotionStatus.ACTIVE;

        await promotionsService.changeStatus(promotion.id, newStatus);
        toast.success('Estado actualizado');
        await loadPromotions();
      } catch (error) {
        console.error('Error toggling status:', error);
        toast.error('Error al cambiar el estado');
      }
    },
    [loadPromotions]
  );

  return {
    // State
    promotions,
    loading,
    statusFilter,
    currentPage,
    totalPages,
    formState,
    formData,

    // Setters
    setStatusFilter,
    setCurrentPage,
    setFormData,

    // Methods
    openCreate,
    openEdit,
    closeForm,
    handleFormChange,
    handlePhotoChange,
    savePromotion,
    deletePromotion: (id: number) =>
      setFormState((prev) => ({ ...prev, deleteConfirm: id })),
    closeDeleteDialog: () =>
      setFormState((prev) => ({ ...prev, deleteConfirm: null })),
    confirmDelete: () => {
      if (formState.deleteConfirm !== null) {
        deletePromotionHandler(formState.deleteConfirm);
      }
    },
    toggleStatus,
  };
}

