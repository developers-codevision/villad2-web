// Admin Reviews Hook - Business logic for review management

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { reviewsService } from '@/modules/shared/services';
import { Review, ReviewStatus } from '@/modules/shared/types/api.types';

export interface ReviewFormState {
  open: boolean;
  editing: Review | null;
  saving: boolean;
  deleteConfirm: number | null;
  responseDialog: number | null;
}

export interface ReviewFormData {
  response: string;
}

/**
 * Custom hook for managing reviews in admin panel
 * Handles CRUD operations, status changes, and responses
 */
export function useReviewManagement() {
  // List state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Form state
  const [formState, setFormState] = useState<ReviewFormState>({
    open: false,
    editing: null,
    saving: false,
    deleteConfirm: null,
    responseDialog: null,
  });

  // Form data for response
  const [responseFormData, setResponseFormData] = useState<ReviewFormData>({
    response: '',
  });

  // ============================================
  // DATA LOADING
  // ============================================

  /**
   * Load all reviews from API
   */
  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const status =
        statusFilter === 'all' ? undefined : (statusFilter as ReviewStatus);
      const response = await reviewsService.getAll(status, currentPage, limit);
      setReviews(response.reviews);
      setTotalPages(Math.ceil(response.total / limit));
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast.error('Error al cargar las reseñas');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, currentPage]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  // ============================================
  // FORM HANDLERS
  // ============================================

  /**
   * Open review details dialog
   */
  const openReviewDetails = useCallback((review: Review) => {
    setFormState((prev) => ({ ...prev, open: true, editing: review }));
    setResponseFormData({ response: review.response || '' });
  }, []);

  /**
   * Close review details dialog
   */
  const closeReviewDetails = useCallback(() => {
    setFormState((prev) => ({ ...prev, open: false, editing: null }));
    setResponseFormData({ response: '' });
  }, []);

  /**
   * Open response dialog for a review
   */
  const openResponseDialog = useCallback((reviewId: number, currentResponse?: string) => {
    setFormState((prev) => ({ ...prev, responseDialog: reviewId }));
    setResponseFormData({ response: currentResponse || '' });
  }, []);

  /**
   * Close response dialog
   */
  const closeResponseDialog = useCallback(() => {
    setFormState((prev) => ({ ...prev, responseDialog: null }));
    setResponseFormData({ response: '' });
  }, []);

  /**
   * Save response to review
   */
  const saveResponse = useCallback(async (reviewId: number) => {
    if (!responseFormData.response.trim()) {
      toast.error('La respuesta no puede estar vacía');
      return;
    }

    setFormState((prev) => ({ ...prev, saving: true }));

    try {
      await reviewsService.addResponse(reviewId, responseFormData.response);
      toast.success('Respuesta guardada correctamente');
      closeResponseDialog();
      await loadReviews();
    } catch (error) {
      console.error('Error saving response:', error);
      toast.error('Error al guardar la respuesta');
    } finally {
      setFormState((prev) => ({ ...prev, saving: false }));
    }
  }, [responseFormData, closeResponseDialog, loadReviews]);

  /**
   * Change review status (approve/reject)
   */
  const changeStatus = useCallback(
    async (reviewId: number, status: ReviewStatus) => {
      setFormState((prev) => ({ ...prev, saving: true }));

      try {
        await reviewsService.changeStatus(reviewId, status);
        toast.success(
          status === ReviewStatus.ACTIVE
            ? 'Reseña aprobada'
            : 'Reseña rechazada'
        );
        await loadReviews();
        closeReviewDetails();
      } catch (error) {
        console.error('Error changing status:', error);
        toast.error('Error al cambiar el estado');
      } finally {
        setFormState((prev) => ({ ...prev, saving: false }));
      }
    },
    [loadReviews, closeReviewDetails]
  );

  /**
   * Delete review
   */
  const deleteReview = useCallback(async (id: number) => {
    setFormState((prev) => ({ ...prev, deleteConfirm: null, saving: true }));

    try {
      await reviewsService.delete(id);
      toast.success('Reseña eliminada correctamente');
      await loadReviews();
      closeReviewDetails();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Error al eliminar la reseña');
    } finally {
      setFormState((prev) => ({ ...prev, saving: false }));
    }
  }, [loadReviews, closeReviewDetails]);

  return {
    // State
    reviews,
    loading,
    statusFilter,
    currentPage,
    totalPages,
    formState,
    responseFormData,

    // Setters
    setStatusFilter,
    setCurrentPage,
    setResponseFormData,

    // Methods
    openReviewDetails,
    closeReviewDetails,
    openResponseDialog,
    closeResponseDialog,
    saveResponse,
    changeStatus,
    deleteReview: (id: number) =>
      setFormState((prev) => ({ ...prev, deleteConfirm: id })),
    confirmDelete: () => {
      if (formState.deleteConfirm !== null) {
        deleteReview(formState.deleteConfirm);
      }
    },
  };
}

