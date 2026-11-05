import {
  onlyNumbers,
} from "../utils/string.utils.js";

/**
 * @param {string | number} value
 * @param {number} expectedLength
 * @returns {boolean}
 */
export const isValidPhoneNumber = (
  value,
  expectedLength
) => {
  return (
    onlyNumbers(value).length === expectedLength
  );
};