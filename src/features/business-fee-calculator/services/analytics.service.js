import {
  CLEVERTAP_EVENT,
  INTERACTION_TYPES,
  PAYMENT_METHODS
} from '../constants/business-fee-calculator.constants.js';

import {
  FEE_SCENARIOS
} from '../constants/business-fee-calculator.rates.js';

import {
  sendCleverTapEventEventOnly
} from '../../../shared/services/clevertap.service.js';

/**
 * @typedef {Object} AnalyticsContext
 * @property {string} phone
 * @property {number} amount
 * @property {'card' | 'link'} method
 * @property {'nequi' | 'other'} source
 * @property {keyof typeof FEE_SCENARIOS} scenarioKey
 */

/** @param {Record<string, string | number>} properties */
const sendEvent = (properties) => {
  if (
    !window.clevertap?.onUserLogin?.push ||
    !window.clevertap?.event?.push
  ) {
    console.warn(
      'CleverTap no está disponible para registrar la calculadora'
    );
    return;
  }

  try {
    sendCleverTapEventEventOnly(
      CLEVERTAP_EVENT,
      properties
    );
  } catch (error) {
    console.warn(
      'No se pudo registrar el evento de la calculadora',
      error
    );
  }
};

/** @param {AnalyticsContext & { interactionType: string }} eventData */
const buildEventProperties = ({
  phone,
  interactionType,
  amount,
  method,
  source,
  scenarioKey
}) => {
  const scenario =
    FEE_SCENARIOS[scenarioKey];

  /** @type {Record<string, string | number>} */
  const properties = {
    Phone: phone,
    interaction_type: interactionType,
    sale_amount: amount,
    payment_method: method,
    fee_rate: Number(
      (scenario.nequiRate * 100).toFixed(2)
    )
  };

  if (method === PAYMENT_METHODS.link) {
    properties.payment_source = source;
  }

  return properties;
};

/** @param {AnalyticsContext & { result: { fee: number, net: number } }} eventData */
export const sendSimulationEvent = ({
  phone,
  amount,
  method,
  source,
  scenarioKey,
  result
}) => {
  sendEvent({
    ...buildEventProperties({
      phone,
      interactionType: INTERACTION_TYPES.simulation,
      amount,
      method,
      source,
      scenarioKey
    }),
    fee_amount: result.fee,
    net_amount: result.net
  });
};

/** @param {AnalyticsContext & { ctaName: string }} eventData */
export const sendMobileCtaEvent = ({
  phone,
  amount,
  method,
  source,
  scenarioKey,
  ctaName
}) => {
  sendEvent({
    ...buildEventProperties({
      phone,
      interactionType: INTERACTION_TYPES.mobileCtaClick,
      amount,
      method,
      source,
      scenarioKey
    }),
    cta_name: ctaName
  });
};