// Shared Reservations Validations

import { ReservationFormData, ClientReservationFormData } from '@/modules/shared/types/reservations.types';

/**
 * Validate reservation form data
 */
export function validateReservationForm(
  formData: ReservationFormData
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!formData.roomId) errors.push('Selecciona una habitacin');
  if (!formData.guestFirstName.trim()) errors.push('El nombre es requerido');
  if (!formData.guestLastName.trim()) errors.push('El apellido es requerido');
  if (!formData.guestEmail.trim()) errors.push('El email es requerido');
  if (!formData.guestPhone.trim()) errors.push('El telono es requerido');
  if (!formData.checkIn) errors.push('Selecciona fecha de entrada');
  if (!formData.checkOut) errors.push('Selecciona fecha de salida');
  if (formData.baseGuestsCount < 1) errors.push('Mnimo 1 husped base');

  // Email validation
  if (formData.guestEmail && !isValidEmail(formData.guestEmail)) {
    errors.push('Email invlido');
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
    errors.push('El total de huspedes no coincide con la suma de huspedes base y adicionales');
  }

  // Additional guests validation (all companions = total - 1)
  const expectedAdditional = formData.totalGuests - 1;
  if (formData.additionalGuests.length !== expectedAdditional) {
    errors.push('El nmmero de huspedes adicionales no coincide con el total especificado');
  }
  formData.additionalGuests.forEach((guest, index) => {
    if (!guest.firstName.trim()) {
      errors.push(`El nombre del acompaante #${index + 1} es requerido`);
    }
    if (!guest.lastName.trim()) {
      errors.push(`El apellido del acompaante #${index + 1} es requerido`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate client reservation form data
 */
export function validateClientReservationForm(
  formData: ClientReservationFormData
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!formData.roomId) errors.push('Selecciona una habitacin');
  if (!formData.guestFirstName.trim()) errors.push('El nombre es requerido');
  if (!formData.guestLastName.trim()) errors.push('El apellido es requerido');
  if (!formData.guestEmail.trim()) errors.push('El email es requerido');
  if (!formData.guestPhone.trim()) errors.push('El telono es requerido');
  if (!formData.checkIn) errors.push('Selecciona fecha de entrada');
  if (!formData.checkOut) errors.push('Selecciona fecha de salida');
  if (formData.baseGuestsCount < 1) errors.push('Mnimo 1 husped base');

  // Email validation
  if (formData.guestEmail && !isValidEmail(formData.guestEmail)) {
    errors.push('Email invlido');
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
    errors.push('El total de huspedes no coincide con la suma de huspedes base y adicionales');
  }

  // Additional guests validation: all non-principal guests (totalGuests - 1)
  const expectedAdditional = Math.max(formData.totalGuests - 1, 0);
  if (formData.additionalGuests.length !== expectedAdditional) {
    errors.push('El nmmero de huspedes registrados no coincide con el total seleccionado');
  }
  formData.additionalGuests.forEach((guest, index) => {
    if (!guest.firstName.trim()) {
      errors.push(`El nombre del husped #${index + 2} es requerido`);
    }
    if (!guest.lastName.trim()) {
      errors.push(`El apellido del husped #${index + 2} es requerido`);
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

