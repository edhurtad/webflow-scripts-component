import {
  FX_CONFIG
} from '../constants/fx.constants.js';

const createMessageId = () => {
  if (
    globalThis.crypto &&
    typeof globalThis.crypto.randomUUID ===
      'function'
  ) {
    return globalThis.crypto.randomUUID();
  }

  return [
    'fx',
    Date.now(),
    Math.random()
      .toString(16)
      .slice(2)
  ].join('-');
};

/**
 * @param {import('../view-models/fx-converter.view-model.js').FxConverterViewModel} viewModel
 */
export const mapFxConversionRequest = (
  viewModel
) => ({
  event:
    FX_CONFIG.EVENT_NAME,

  messageId:
    createMessageId(),

  timestamp:
    new Date()
      .toISOString(),

  source:
    FX_CONFIG.SOURCE,

  phone:
    viewModel.phone,

  phoneInternational:
    `${FX_CONFIG.COUNTRY_CODE}${viewModel.phone}`,

  dataConsent:
    viewModel.consent,

  conversion: {
    amount:
      viewModel.amount,

    currencyFrom:
      viewModel.currencyFrom,

    currencyTo:
      viewModel.currencyTo,

    interests:
      viewModel.interests
  }
});