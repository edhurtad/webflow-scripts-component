export const STORAGE_KEY =
  'fee-calc-lead';

export const SIMULATE_EVENT =
  'fee-calc:simulate';

export const CLEVERTAP_EVENT =
  'nn_calculadora_tarifas_web';

export const COUNTRY_CODE =
  '+57';

export const MAX_AMOUNT_DIGITS =
  9;

export const PHONE_LENGTH =
  10;

export const PAYMENT_METHODS =
  Object.freeze({
    card: 'card',
    link: 'link'
  });

export const PAYMENT_SOURCES =
  Object.freeze({
    nequi: 'nequi',
    other: 'other'
  });

export const INTERACTION_TYPES =
  Object.freeze({
    simulation: 'simulation',
    mobileCtaClick: 'mobile_cta_click'
  });

export const MOBILE_CTA =
  Object.freeze({
    getNequiBusiness: 'get_nequi_business',
    startCollecting: 'start_collecting'
  });