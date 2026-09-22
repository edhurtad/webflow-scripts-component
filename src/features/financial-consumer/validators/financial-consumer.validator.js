/**
 * Elimina cualquier carácter que no sea numérico.
 *
 * @param {string | number} value
 * @returns {string}
 */
export const sanitizeDigits = (value = "") => {
  return String(value).replace(/\D/g, "");
};

/**
 * Valida que un número de teléfono tenga
 * exactamente la longitud esperada.
 *
 * @param {string | number} value
 * @param {number} [expectedLength=10]
 * @returns {boolean}
 */
export const isValidPhoneNumber = (
  value,
  expectedLength = 10
) => {
  return sanitizeDigits(value).length === expectedLength;
};

/**
 * Valida que el número de documento contenga
 * entre 1 y el máximo de caracteres permitidos.
 *
 * @param {string | number} value
 * @param {number} [maxLength=15]
 * @returns {boolean}
 */
export const isValidDocumentNumber = (
  value,
  maxLength = 15
) => {
  const documentNumber = sanitizeDigits(value);

  return (
    documentNumber.length > 0 &&
    documentNumber.length <= maxLength
  );
};

/**
 * Valida el formato básico de un correo electrónico.
 *
 * @param {string} value
 * @returns {boolean}
 */
export const isValidEmail = (value = "") => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    String(value).trim()
  );
};

/**
 * Valida que un archivo no supere
 * el tamaño máximo permitido.
 *
 * @param {File | null | undefined} file
 * @param {number} maxFileSize
 * @returns {boolean}
 */
export const isValidFileSize = (
  file,
  maxFileSize
) => {
  if (!file) return true;

  return file.size <= maxFileSize;
};