/**
 * Helpers para validación de campos del formulario de reserva
 */

/**
 * Verifica si existe un error específico en la lista
 */
export const hasFieldError = (
  fieldName: string,
  errors: string[] = []
): boolean => {
  return errors.some(error =>
    error.toLowerCase().includes(fieldName.toLowerCase())
  );
};

/**
 * Determina el className para un input con error
 */
export const getErrorClassName = (
  fieldName: string,
  errors: string[] = []
): string => {
  return hasFieldError(fieldName, errors)
    ? 'border-red-500 focus:border-red-500'
    : '';
};


