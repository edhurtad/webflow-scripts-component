import {
  formatNumber
} from '../../../shared/utils/formatters/number.formatter.js';

import {
  onlyNumbers
} from '../../../shared/utils/string.utils.js';

import {
  FX_CURRENCIES
} from '../constants/fx.constants.js';

/**
 * @typedef {'COP' | 'USD'} FxCurrency
 */

/**
 * @param {string} value
 * @returns {string}
 */
const sanitizeCopAmount = (
  value = ''
) => onlyNumbers(value);

/**
 * @param {string} value
 * @returns {string}
 */
const sanitizeUsdAmount = (
  value = ''
) => {
  const raw =
    String(value)
      .replace(
        /[^\d.,]/g,
        ''
      )
      .replace(
        /\./g,
        ''
      );

  const commaIndex =
    raw.indexOf(',');

  if (commaIndex === -1) {
    return onlyNumbers(raw);
  }

  const integerPart =
    onlyNumbers(
      raw.slice(
        0,
        commaIndex
      )
    );

  const decimalPart =
    onlyNumbers(
      raw.slice(
        commaIndex + 1
      )
    ).slice(0, 2);

  return `${integerPart},${decimalPart}`;
};

/**
 * @param {string} value
 * @returns {string}
 */
const formatCopInput = (
  value
) => {
  const digits =
    onlyNumbers(value);

  if (!digits) {
    return '';
  }

  return formatNumber(
    Number(digits)
  );
};

/**
 * @param {string} value
 * @returns {string}
 */
const formatUsdInput = (
  value
) => {
  if (!value) {
    return '';
  }

  const normalized =
    String(value);

  const hasComma =
    normalized.includes(',');

  const [
    integerPart,
    decimalPart = ''
  ] = normalized.split(',');

  const integerDigits =
    onlyNumbers(
      integerPart
    );

  const integerFormatted =
    formatNumber(
      Number(
        integerDigits || '0'
      )
    );

  if (!hasComma) {
    return integerFormatted;
  }

  const decimals =
    onlyNumbers(
      decimalPart
    ).slice(0, 2);

  return `${integerFormatted},${decimals}`;
};

/**
 * @param {string} value
 * @param {FxCurrency} currency
 * @returns {string}
 */
export const sanitizeFxAmount = (
  value,
  currency
) => (
  currency === FX_CURRENCIES.COP
    ? sanitizeCopAmount(value)
    : sanitizeUsdAmount(value)
);

/**
 * @param {string} value
 * @param {FxCurrency} currency
 * @returns {string}
 */
export const formatFxAmountInput = (
  value,
  currency
) => (
  currency === FX_CURRENCIES.COP
    ? formatCopInput(value)
    : formatUsdInput(value)
);

/**
 * @param {string} value
 * @param {FxCurrency} currency
 * @returns {number}
 */
export const parseFxAmount = (
  value,
  currency
) => {
  if (!value) {
    return 0;
  }

  const normalized =
    currency === FX_CURRENCIES.COP
      ? onlyNumbers(value)
      : String(value)
          .replace(
            /\./g,
            ''
          )
          .replace(
            ',',
            '.'
          )
          .replace(
            /[^\d.]/g,
            ''
          );

  const amount =
    Number(normalized);

  return Number.isFinite(amount)
    ? amount
    : 0;
};