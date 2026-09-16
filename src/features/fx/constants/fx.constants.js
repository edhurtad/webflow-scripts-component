/**
 * @typedef {'COP' | 'USD'} FxCurrency
 */

/**
 * @typedef {
 *   'travel' |
 *   'save' |
 *   'buy' |
 *   'invest' |
 *   'send' |
 *   'study'
 * } FxInterest
 */

export const FX_CONFIG = Object.freeze({
  COUNTRY_CODE: '+57',
  SOURCE: 'webflow',
  EVENT_NAME: 'fx_conversion',
  MAX_INTERESTS: 2,
  PHONE_LENGTH: 10
});

export const FX_CURRENCIES = Object.freeze({
  COP: 'COP',
  USD: 'USD'
});

export const FX_DIRECTIONS = Object.freeze({
  COP_USD: 'COP_USD',
  USD_COP: 'USD_COP'
});

export const FX_INTERESTS = Object.freeze({
  TRAVEL: 'travel',
  SAVE: 'save',
  BUY: 'buy',
  INVEST: 'invest',
  SEND: 'send',
  STUDY: 'study'
});