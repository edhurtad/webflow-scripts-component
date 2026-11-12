import {
  COUNTRY_CODE,
  MAX_AMOUNT_DIGITS,
  PHONE_LENGTH
} from '../constants/business-fee-calculator.constants.js';

import {
  onlyNumbers
} from '../../../shared/utils/string.utils.js';

import {
  formatCurrency
} from '../../../shared/utils/formatters/currency.formatter.js';

import {
  formatNumber
} from '../../../shared/utils/formatters/number.formatter.js';

export const normalizeSaleAmount = (
  value
) => {
  const digits = onlyNumbers(value)
    .slice(0, MAX_AMOUNT_DIGITS);

  return digits
    ? Number(digits)
    : 0;
};

export const normalizeBusinessPhone = (
  value
) => {
  const digits =
    onlyNumbers(value);

  const countryCode =
    onlyNumbers(COUNTRY_CODE);

  const nationalPhone =
    digits.length > PHONE_LENGTH &&
    digits.startsWith(countryCode)
      ? digits.slice(countryCode.length)
      : digits;

  return nationalPhone.slice(
    0,
    PHONE_LENGTH
  );
};

export const formatSaleAmountInput = (
  amount
) => {
  return amount > 0
    ? formatCurrency(amount)
    : '';
};

export const formatPercentage = (
  rate
) => {
  return `${formatNumber(
    rate * 100,
    0,
    2
  )}%`;
};

export const formatDiscount = (
  amount
) => {
  return formatCurrency(
    -Math.abs(amount)
  );
};