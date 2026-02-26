// Client Reservation Hook - Business logic for client-side reservations

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Room } from '@/modules/shared/types/api.types';
import { ClientReservationFormData } from '@/modules/shared/types/reservations.types';
import { reservationsService } from '@/modules/shared/services';
import {
  ClientReservationStep,
} from '../../admin/types/reservations.types';
import {
  createEmptyClientReservationForm,
  clientFormDataToCreateDto,

} from '../../admin/utils/reservations.utils';
import { validateReservationForm } from '@/modules/shared/validations/reservations.validation';

import { calculateTotalPrice,
  calculateNights} from '../../shared/utils/reservations.utils.ts'
import { useAvailability } from '@/modules/shared/hooks';

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
  const [paymentMethod, setPaymentMethod] = useState<'zelle' | 'bizum' | 'stripe' | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Availability
  const { occupiedDates } = useAvailability(formData.roomId);

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
        formData.checkOut,
        formData.extraGuestsCount
      );

      return { nights, totalPrice };
    },
    [formData.checkIn, formData.checkOut, formData.extraGuestsCount]
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
          formData.guestFirstName &&
          formData.guestLastName &&
          formData.guestEmail &&
          formData.guestPhone &&
          formData.baseGuestsCount > 0
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
    setPaymentMethod(null);
    setClientSecret(null);
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

    const steps: ClientReservationStep['current'][] = ['dates', 'room', 'details', 'payment', 'confirmation'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  }, [step, isStepComplete]);

  /**
   * Go to previous step
   */
  const previousStep = useCallback(() => {
    const steps: ClientReservationStep['current'][] = ['dates', 'room', 'details', 'payment', 'confirmation'];
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
   * Submit reservation (go to payment step)
   */
  const submitReservation = useCallback(
    async () => {
      // Validate form
      const validation = validateReservationForm(formData, 'client');
      if (!validation.valid) {
        validation.errors.forEach(error => toast.error(error));
        return;
      }

      // Go to payment step
      setStep('payment');
    },
    [formData]
  );

  /**
   * Submit payment
   */
  const submitPayment = useCallback(
    async (method: 'zelle' | 'bizum' | 'stripe') => {
      setPaymentMethod(method);
      setSubmitting(true);

      try {
        const createDto = clientFormDataToCreateDto(formData);
        console.log(createDto)
        if (method === 'stripe') {
          const response = await reservationsService.createWithPayment(createDto);
          setConfirmationId(response.reservation.id);
          setClientSecret(response.clientSecret);
          // Stay on payment step to show Stripe form
        } else {
          // For Zelle/Bizum, create reservation normally
          const response = await reservationsService.create(createDto);
          setConfirmationId(response.id);
          toast.success('¡Reserva solicitada correctamente!');
          setConfirmed(true);
          setStep('confirmation');
        }
      } catch (error) {
        console.error('Error processing payment:', error);
        toast.error('Error al procesar el pago. Por favor intenta de nuevo.');
      } finally {
        setSubmitting(false);
      }
    },
    [formData]
  );

  // ============================================
  // RETURN
  // ============================================

  // --- canSubmit: validación centralizada ---
  const canSubmit = validateReservationForm(formData, 'client').valid;

  return {
    // State
    formData,
    step,
    submitting,
    confirmed,
    confirmationId,
    paymentMethod,
    clientSecret,
    occupiedDates,

    // Computed
    isStepComplete: isStepComplete(),
    reservationSummary,
    canSubmit,

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
    submitPayment,
  };
}
