import {
  FX_CONFIG,
  FX_CURRENCIES
} from '../constants/fx.constants.js';

/**
 * @typedef {'INVALID_PHONE' | 'CONSENT_REQUIRED' | 'INVALID_AMOUNT' | 'MAX_INTERESTS' | 'INVALID_CURRENCY_PAIR'} FxValidationError
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
export function isValidPhone(phone) {
  return /^3\d{9}$/.test(
    String(phone || '')
  );
}

/**
 * @param {string} currencyFrom
 * @param {string} currencyTo
 * @returns {boolean}
 */
export function isValidCurrencyPair(
  currencyFrom,
  currencyTo
) {
  return (
    (
      currencyFrom === FX_CURRENCIES.COP &&
      currencyTo === FX_CURRENCIES.USD
    ) ||
    (
      currencyFrom === FX_CURRENCIES.USD &&
      currencyTo === FX_CURRENCIES.COP
    )
  );
}

/**
 * @param {{
 *   phone: string,
 *   consent: boolean,
 *   amount: number,
 *   currencyFrom: string,
 *   currencyTo: string,
 *   interests: string[]
 * }} data
 * @returns {FxValidationResult}
 */
export function validateFxConversion(data) {
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
    !Array.isArray(data.interests) ||
    data.interests.length >
      FX_CONFIG.MAX_INTERESTS
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
}