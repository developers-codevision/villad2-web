// Shared Reservations Validations

import { ReservationFormDataBase, ClientReservationFormData } from '@/modules/shared/types/reservations.types';
import { ReservationFormData } from '@/modules/admin/types/reservations.types';

/**
 * Validate reservation form data
 */
export function validateReservationForm(
  formData: ReservationFormDataBase,
  context: 'admin' | 'client' = 'admin'
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!formData.roomId) errors.push('Selecciona una habitación');
  if (!formData.guestFirstName.trim()) errors.push('El nombre es requerido');
  if (!formData.guestLastName.trim()) errors.push('El apellido es requerido');
  if (!formData.guestEmail.trim()) errors.push('El email es requerido');
  if (!formData.guestPhone.trim()) errors.push('El teléfono es requerido');
  if (!formData.checkIn) errors.push('Selecciona fecha de entrada');
  if (!formData.checkOut) errors.push('Selecciona fecha de salida');
  if (formData.baseGuestsCount < 1) errors.push('Mínimo 1 huésped base');

  // Email validation
  if (formData.guestEmail && !isValidEmail(formData.guestEmail)) {
    errors.push('Email inválido');
  }

  // Date validation
  if (formData.checkIn && formData.checkOut) {
    if (formData.checkOut <= formData.checkIn) {
      errors.push('La fecha de salida debe ser posterior a la de entrada');
    }
    if (formData.checkIn < new Date(new Date().setHours(0, 0, 0, 0))) {
      errors.push('La fecha de entrada no puede ser en el pasado');
    }
  }

  // Total guests validation
  if (formData.totalGuests !== formData.baseGuestsCount + formData.extraGuestsCount) {
    errors.push('El total de huéspedes no coincide con la suma de huéspedes base y adicionales');
  }

  // Additional guests validation (all companions = total - 1)
  const expectedAdditional = formData.totalGuests - 1;
  if (formData.additionalGuests.length !== expectedAdditional) {
    const mismatchMessage = context === 'admin'
      ? 'El número de huéspedes adicionales no coincide con el total especificado'
      : 'El número de huéspedes registrados no coincide con el total seleccionado';
    errors.push(mismatchMessage);
  }
  formData.additionalGuests.forEach((guest, index) => {
    const guestLabel = context === 'admin' ? `acompañante #${index + 1}` : `huésped #${index + 2}`;
    if (!guest.firstName.trim()) {
      errors.push(`El nombre del ${guestLabel} es requerido`);
    }
    if (!guest.lastName.trim()) {
      errors.push(`El apellido del ${guestLabel} es requerido`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Simple email validation
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate client reservation form data (wrapper for unified function)
 */
export function validateClientReservationForm(
  formData: ClientReservationFormData
): { valid: boolean; errors: string[] } {
  return validateReservationForm(formData, 'client');
}
