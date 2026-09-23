import {
  onlyNumbers
} from '../string.utils.js';

/**
 * @param {string} value
 * @returns {string}
 */
export const formatPhone = (
  value = ''
) => {
  const digits =
    onlyNumbers(value)
      .slice(0, 10);

  return [
    digits.slice(0, 3),
    digits.slice(3, 6),
    digits.slice(6, 10)
  ]
    .filter(Boolean)
    .join(' ');
};