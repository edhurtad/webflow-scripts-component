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

export const isValidSaleAmount = (
  amount
) => {
  return (
    Number.isFinite(amount) &&
    amount > 0
  );
};

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

export const isValidPaymentMethod = (
  method
) => {
  return Object
    .values(PAYMENT_METHODS)
    .includes(method);
};