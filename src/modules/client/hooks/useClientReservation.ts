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
import { calculateTotalPrice, calculateNights } from '../../shared/utils/reservations.utils.ts';
import { useAvailability } from '@/modules/shared/hooks';
import { PricesResponse } from '@/modules/shared/services/settings.service';

/**
 * Custom hook for managing client-side reservations
 * Handles the booking flow: dates → room selection → guest details → confirmation
 */
export function useClientReservation(prices?: PricesResponse) {
  // Form state
  const [formData, setFormData] = useState<ClientReservationFormData>(
    createEmptyClientReservationForm()
  );

  // Step state
  const [step, setStep] = useState<ClientReservationStep['current']>('dates');
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmationId, setConfirmationId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'zelle' | 'bizum' | 'stripe' | 'paypal' | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Availability
  const { occupiedDates } = useAvailability(formData.roomId);

  // ============================================
  // COMPUTED VALUES
  // ============================================

  /**
   * Calculate nights and total price
   */
  const reservationSummary = useCallback(
    (room?: Room, overridePrices?: PricesResponse) => {
      if (!formData.checkIn || !formData.checkOut || !room) {
        return { nights: 0, totalPrice: 0 };
      }

      const activePrices = overridePrices ?? prices;
      const nights = calculateNights(formData.checkIn, formData.checkOut);
      const baseTotal = calculateTotalPrice(
        room.pricePerNight,
        formData.checkIn,
        formData.checkOut,
        formData.extraGuestsCount,
        room.extraGuestCharge
      );

      // Use prices from settings, fallback to 0 if not loaded yet
      // Force Number() to avoid string concatenation (API returns prices as strings)
      const PRICE_BREAKFAST = Number(activePrices?.breakfastPrice ?? 0);
      const PRICE_EARLY_CHECKIN = Number(activePrices?.earlyCheckInPrice ?? 0);
      const PRICE_LATE_CHECKOUT = Number(activePrices?.lateCheckOutPrice ?? 0);
      const PRICE_TRANSFER_IDA = Number(activePrices?.transferOneWayPrice ?? 0);
      const PRICE_TRANSFER_VUELTA = Number(activePrices?.transferRoundTripPrice ?? 0);

      const breakfastsCost = (formData.breakfasts || 0) * PRICE_BREAKFAST;
      const earlyCheckInCost = formData.earlyCheckIn ? PRICE_EARLY_CHECKIN : 0;
      const lateCheckOutCost = formData.lateCheckOut ? PRICE_LATE_CHECKOUT : 0;
      const transferOneWayCost = formData.transferOneWay ? PRICE_TRANSFER_IDA : 0;
      const transferReturnCost = formData.transferRoundTrip ? PRICE_TRANSFER_VUELTA : 0;

      const totalPrice = baseTotal + breakfastsCost + earlyCheckInCost + lateCheckOutCost + transferOneWayCost + transferReturnCost;

      // Return a detailed breakdown so the UI can present subtotals and avoid duplicating logic
      return {
        nights,
        totalPrice,
        breakdown: {
          baseTotal,
          breakfastsCost,
          earlyCheckInCost,
          lateCheckOutCost,
          transferOneWayCost,
          transferReturnCost,
        },
      };
    },
    [
      formData.checkIn,
      formData.checkOut,
      formData.extraGuestsCount,
      formData.breakfasts,
      formData.earlyCheckIn,
      formData.lateCheckOut,
      formData.transferOneWay,
      formData.transferRoundTrip,
      prices,
    ]
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
      // Clear validation errors when user starts typing
      if (validationErrors.length > 0) {
        setValidationErrors([]);
      }
    },
    [validationErrors.length]
  );

  /**
   * Set date range
   */
  const setDateRange = useCallback((checkIn: Date | undefined, checkOut: Date | undefined) => {
    // Validate that check-in and check-out are at least one night apart
    if (checkIn && checkOut) {
      const nights = calculateNights(checkIn, checkOut);
      if (nights < 1) {
        setValidationErrors(['La reserva debe ser de al menos una noche']);
        return;
      }
    }

    // Clear any previous validation errors
    setValidationErrors([]);

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
        setValidationErrors(validation.errors);
        // Scroll to top to show errors
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Clear any previous errors
      setValidationErrors([]);

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
      setSubmitting(true);

      try {
        const createDto = clientFormDataToCreateDto(formData, method);
        console.log('Creating reservation with payment method:', method, createDto);

        const response = await reservationsService.createWithPayment(createDto);
        console.log('Payment response:', response);

        if (method === 'stripe' && response.paymentSession?.url) {
          // Redirect to Stripe-hosted checkout page
          window.location.href = response.paymentSession.url;
        } else {
          // For Zelle/Bizum, or if no redirect needed, set confirmed
          setConfirmationId(response.reservation.id);
          setPaymentMethod(method);
          toast.success('¡Reserva solicitada correctamente!');
          setConfirmed(true);
          setStep('confirmation');
        }
      } catch (error) {
        console.error('Error processing payment:', error);
        toast.error('Error al procesar el pago. Por favor intenta de nuevo.');
        setPaymentMethod(null);
      } finally {
        setSubmitting(false);
      }
    },
    [formData]
  );

  // Finalize reservation after an external payment provider confirms payment
  const finalizeReservationAfterPayment = useCallback(
    (reservationId: number, method: 'paypal' | 'stripe' | 'zelle' | 'bizum') => {
      setConfirmationId(reservationId);
      setPaymentMethod(method);
      setConfirmed(true);
      setStep('confirmation');
    },
    []
  );

  // ============================================
  // RETURN
  // ============================================

  // --- canSubmit: validación centralizada ---
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
    validationErrors,

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
    submitPayment,

    // Finalize helper for external payment flows
    finalizeReservationAfterPayment,
  };
}
