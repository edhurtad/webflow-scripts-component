import {
  FX_CONFIG,
  FX_CURRENCIES
} from '../constants/fx.constants.js';

/**
 * @typedef {'COP' | 'USD'} FxCurrency
 */

/**
 * @typedef {
 *   'INVALID_PHONE' |
 *   'CONSENT_REQUIRED' |
 *   'INVALID_AMOUNT' |
 *   'MAX_INTERESTS' |
 *   'INVALID_CURRENCY_PAIR'
 * } FxValidationError
 */

/**
 * @typedef {Object} FxValidationData
 * @property {string} phone
 * @property {boolean} consent
 * @property {number} amount
 * @property {FxCurrency} currencyFrom
 * @property {FxCurrency} currencyTo
 * @property {string[]} interests
 */

/**
 * @typedef {Object} FxValidationResult
 * @property {boolean} valid
 * @property {FxValidationError | null} error
 */

/**
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidPhone = (
  phone
) => /^3\d{9}$/.test(
  String(phone || '')
);

/**
 * @param {FxCurrency} currencyFrom
 * @param {FxCurrency} currencyTo
 * @returns {boolean}
 */
export const isValidCurrencyPair = (
  currencyFrom,
  currencyTo
) => (
  (
    currencyFrom === FX_CURRENCIES.COP &&
    currencyTo === FX_CURRENCIES.USD
  ) ||
  (
    currencyFrom === FX_CURRENCIES.USD &&
    currencyTo === FX_CURRENCIES.COP
  )
);

/**
 * @param {string[]} interests
 * @returns {boolean}
 */
export const hasValidInterests = (
  interests
) => (
  Array.isArray(interests) &&
  interests.length <=
    FX_CONFIG.MAX_INTERESTS
);

/**
 * @param {FxValidationData} data
 * @returns {FxValidationResult}
 */
export const validateFxConversion = (
  data
) => {
  if (!isValidPhone(data.phone)) {
    return {
      valid: false,
      error: 'INVALID_PHONE'
    };
  }

  if (data.consent !== true) {
    return {
      valid: false,
      error: 'CONSENT_REQUIRED'
    };
  }

  if (
    !Number.isFinite(data.amount) ||
    data.amount <= 0
  ) {
    return {
      valid: false,
      error: 'INVALID_AMOUNT'
    };
  }

  if (
    !isValidCurrencyPair(
      data.currencyFrom,
      data.currencyTo
    )
  ) {
    return {
      valid: false,
      error: 'INVALID_CURRENCY_PAIR'
    };
  }

  if (
    !hasValidInterests(
      data.interests
    )
  ) {
    return {
      valid: false,
      error: 'MAX_INTERESTS'
    };
  }

  return {
    valid: true,
    error: null
  };
};