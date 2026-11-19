import {
  PHONE_LENGTH,
  PAYMENT_METHODS
} from '../constants/business-fee-calculator.constants.js';

import {
  onlyNumbers
} from '../../../shared/utils/string.utils.js';

import {
  isValidPhoneNumber
} from '../../../shared/validators/phone.validator.js';

/**
 * @param {number} amount
 * @returns {boolean}
 */
export const isValidSaleAmount = (
  amount
) => {
  return (
    Number.isFinite(amount) &&
    amount > 0
  );
};

/**
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidBusinessPhone = (
  phone
) => {
  const digits =
    onlyNumbers(phone);

  return (
    isValidPhoneNumber(
      digits,
      PHONE_LENGTH
    ) &&
    digits.startsWith('3')
  );
};

/**
 * @param {unknown} method
 * @returns {method is 'card' | 'link'}
 */
export const isValidPaymentMethod = (
  method
) => {
  return (
    method === PAYMENT_METHODS.card ||
    method === PAYMENT_METHODS.link
  );
};