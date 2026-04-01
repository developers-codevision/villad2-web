// Shared Reservations Validations

import { ReservationFormDataBase, ClientReservationFormData } from '@/modules/shared/types/reservations.types';
import { isPhoneNumber } from 'class-validator';

/**
 * Check if two dates refer to the same calendar day
 */
function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Parse a "HH:mm" string into total minutes from midnight
 */
function timeToMinutes(time: string): number | null {
  const parts = time.split(':').map(Number);
  if (parts.length < 2 || parts.some(isNaN)) return null;
  return parts[0] * 60 + parts[1];
}

/**
 * Simple email validation
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate reservation form data
 */
export function validateReservationForm(
  formData: ReservationFormDataBase,
  context: 'admin' | 'client' = 'admin'
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // ── Required fields by context ──────────────────────────────────────────
  if (!formData.roomId) errors.push('Selecciona una habitación');
  if (!formData.guestFirstName.trim()) errors.push('El nombre es requerido');

  if (context === 'client') {
    if (!formData.guestLastName.trim()) errors.push('El apellido es requerido');
    if (!formData.guestSex) errors.push('El sexo es requerido');
    if (!formData.guestEmail.trim()) errors.push('El email es requerido');
    if (!formData.guestPhone.trim()) errors.push('El teléfono es requerido');
    if (!formData.guestIdNumber.trim()) errors.push('El número de identificación es requerido');
    if (!formData.checkIn) errors.push('Selecciona fecha de entrada');
    if (!formData.checkOut) errors.push('Selecciona fecha de salida');
    if (formData.totalGuests < 1) errors.push('Selecciona el número de huéspedes');
    if (formData.baseGuestsCount < 1) errors.push('Mínimo 1 huésped base');
  }

  // ── Email validation (only if provided) ─────────────────────────────────
  if (formData.guestEmail && !isValidEmail(formData.guestEmail)) {
    errors.push('Email inválido');
  }

  // ── Phone validation ─────────────────────────────────────────────────────
  if (formData.guestPhone && !isPhoneNumber(formData.guestPhone)) {
    errors.push('El teléfono debe tener un formato internacional válido (ej. +51 987 654 321)');
  }

  // ── Date / time validation ───────────────────────────────────────────────
  if (formData.checkIn && formData.checkOut) {
    const sameDay = isSameDay(formData.checkIn, formData.checkOut);

    if (sameDay) {
      if (!formData.checkInTime) errors.push('La hora de entrada es requerida para reservas de un día');
      if (!formData.checkOutTime) errors.push('La hora de salida es requerida para reservas de un día');

      if (formData.checkInTime && formData.checkOutTime) {
        const inMinutes = timeToMinutes(formData.checkInTime);
        const outMinutes = timeToMinutes(formData.checkOutTime);
        if (inMinutes !== null && outMinutes !== null && outMinutes <= inMinutes) {
          errors.push('La hora de salida debe ser posterior a la hora de entrada');
        }
      }
    } else if (formData.checkOut < formData.checkIn) {
      errors.push('La fecha de salida debe ser posterior a la de entrada');
    }

    if (formData.checkIn < new Date(new Date().setHours(0, 0, 0, 0))) {
      errors.push('La fecha de entrada no puede ser en el pasado');
    }
  }

  // ── Guests validation (only client) ─────────────────────────────────────
  if (context === 'client') {
    if (formData.totalGuests !== formData.baseGuestsCount + formData.extraGuestsCount) {
      errors.push('El total de huéspedes no coincide con la suma de huéspedes base y adicionales');
    }

    const expectedAdditional = formData.totalGuests - 1;
    if (formData.additionalGuests.length !== expectedAdditional) {
      errors.push('El número de huéspedes registrados no coincide con el total seleccionado');
    }

    formData.additionalGuests.forEach((guest, index) => {
      if (!guest.firstName.trim()) errors.push(`El nombre del huésped #${index + 2} es requerido`);
      if (!guest.lastName.trim()) errors.push(`El apellido del huésped #${index + 2} es requerido`);
      if (!guest.sex) errors.push(`El sexo del huésped #${index + 2} es requerido`);
    });
  }

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
  return validateReservationForm(formData, 'client');
}

/**
 * Validate admin reservation form data
 * Required: roomId + guestFirstName only
 */
export function validateAdminReservationForm(
  formData: ReservationFormDataBase
): { valid: boolean; errors: string[] } {
  return validateReservationForm(formData, 'admin');
}