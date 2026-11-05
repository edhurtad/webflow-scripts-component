import {
  onlyNumbers,
} from "../../../shared/utils/string.utils.js";

/**
 * @param {string | number} value
 * @param {number} maxLength
 * @returns {boolean}
 */
export const isValidDocumentNumber = (
  value,
  maxLength
) => {
  const documentNumber = onlyNumbers(value);

  return (
    documentNumber.length > 0 &&
    documentNumber.length <= maxLength
  );
};