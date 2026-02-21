// Client Reservation Hook - Business logic for client-side reservations

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Room } from '@/modules/shared/types/api.types';
import {
  ClientReservationFormData,
  ClientReservationStep,
} from '../../admin/types/reservations.types';
import {
  createEmptyClientReservationForm,
  validateClientReservationForm,
  clientFormDataToCreateDto,
  calculateTotalPrice,
  calculateNights,
} from '../../admin/utils/reservations.utils';

/**
 * Custom hook for managing client-side reservations
 * Handles the booking flow: dates → room selection → guest details → confirmation
 */
export function useClientReservation() {
  // Form state
  const [formData, setFormData] = useState<ClientReservationFormData>(
    createEmptyClientReservationForm()
  );

  // Step state
  const [step, setStep] = useState<ClientReservationStep['current']>('dates');
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmationId, setConfirmationId] = useState<number | null>(null);

  // ============================================
  // COMPUTED VALUES
  // ============================================

  /**
   * Calculate nights and total price
   */
  const reservationSummary = useCallback(
    (room?: Room) => {
      if (!formData.checkIn || !formData.checkOut || !room) {
        return { nights: 0, totalPrice: 0 };
      }

      const nights = calculateNights(formData.checkIn, formData.checkOut);
      const totalPrice = calculateTotalPrice(
        room.pricePerNight,
        formData.checkIn,
        formData.checkOut
      );

      return { nights, totalPrice };
    },
    [formData.checkIn, formData.checkOut]
  );

  /**
   * Check if current step is complete
   */
  const isStepComplete = useCallback((): boolean => {
    switch (step) {
      case 'dates':
        return !!formData.checkIn && !!formData.checkOut;
      case 'room':
        return !!formData.roomId;
      case 'details':
        return !!(
          formData.guestName &&
          formData.guestEmail &&
          formData.guests > 0
        );
      case 'confirmation':
        return false;
      default:
        return false;
    }
  }, [step, formData]);

  // ============================================
  // FORM MANAGEMENT
  // ============================================

  /**
   * Update form field
   */
  const updateFormField = useCallback(
    <K extends keyof ClientReservationFormData>(
      field: K,
      value: ClientReservationFormData[K]
    ) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    },
    []
  );

  /**
   * Set date range
   */
  const setDateRange = useCallback((checkIn: Date | undefined, checkOut: Date | undefined) => {
    setFormData(prev => ({ ...prev, checkIn, checkOut }));
  }, []);

  /**
   * Select room
   */
  const selectRoom = useCallback((roomId: number) => {
    setFormData(prev => ({ ...prev, roomId }));
  }, []);

  /**
   * Reset form
   */
  const resetForm = useCallback(() => {
    setFormData(createEmptyClientReservationForm());
    setStep('dates');
    setConfirmed(false);
    setConfirmationId(null);
  }, []);

  // ============================================
  // STEP NAVIGATION
  // ============================================

  /**
   * Go to next step
   */
  const nextStep = useCallback(() => {
    if (!isStepComplete()) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    const steps: ClientReservationStep['current'][] = ['dates', 'room', 'details', 'confirmation'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  }, [step, isStepComplete]);

  /**
   * Go to previous step
   */
  const previousStep = useCallback(() => {
    const steps: ClientReservationStep['current'][] = ['dates', 'room', 'details', 'confirmation'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  }, [step]);

  /**
   * Go to specific step
   */
  const goToStep = useCallback((targetStep: ClientReservationStep['current']) => {
    setStep(targetStep);
  }, []);

  // ============================================
  // SUBMISSION
  // ============================================

  /**
   * Submit reservation
   */
  const submitReservation = useCallback(
    async (room: Room) => {
      // Validate form
      const validation = validateClientReservationForm(formData);
      if (!validation.valid) {
        validation.errors.forEach(error => toast.error(error));
        return;
      }

      setSubmitting(true);

      try {
        // Calculate total price
        const { totalPrice } = reservationSummary(room);

        // Convert to DTO
        const createDto = clientFormDataToCreateDto(formData, totalPrice);

        // TODO: Replace with actual API call
        // const response = await reservationsService.create(createDto);
        // setConfirmationId(response.id);

        // Mock success
        await new Promise(resolve => setTimeout(resolve, 1000));
        setConfirmationId(Math.floor(Math.random() * 10000));

        toast.success('¡Reserva solicitada correctamente!');
        setConfirmed(true);
        setStep('confirmation');
      } catch (error) {
        console.error('Error submitting reservation:', error);
        toast.error('Error al procesar la reserva. Por favor intenta de nuevo.');
      } finally {
        setSubmitting(false);
      }
    },
    [formData, reservationSummary]
  );

  // ============================================
  // RETURN
  // ============================================

  return {
    // State
    formData,
    step,
    submitting,
    confirmed,
    confirmationId,

    // Computed
    isStepComplete: isStepComplete(),
    reservationSummary,

    // Form management
    updateFormField,
    setDateRange,
    selectRoom,
    setFormData,
    resetForm,

    // Step navigation
    nextStep,
    previousStep,
    goToStep,

    // Submission
    submitReservation,
  };
}

