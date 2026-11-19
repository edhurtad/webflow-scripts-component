import {
  SCENARIO_CONTENT
} from '../constants/business-fee-calculator.content.js';

import {
  FEE_SCENARIOS
} from '../constants/business-fee-calculator.rates.js';

import {
  VALIDATION_MESSAGES
} from '../constants/business-fee-calculator.messages.js';

import {
  COUNTRY_CODE,
  PAYMENT_METHODS
} from '../constants/business-fee-calculator.constants.js';

import {
  formatCurrency
} from '../../../shared/utils/formatters/currency.formatter.js';

import {
  formatPhone
} from '../../../shared/utils/formatters/phone.formatter.js';

import {
  formatDiscount,
  formatPercentage
} from '../view-models/business-fee-calculator.view-model.js';

import {
  isValidBusinessPhone,
  isValidPaymentMethod,
  isValidSaleAmount
} from '../validators/business-fee-calculator.validator.js';

/** @typedef {ReturnType<typeof import('./business-fee-calculator.elements.js').getCalculatorElements>} CalculatorElements */
/** @typedef {ReturnType<typeof import('../services/fee-calculation.service.js').calculateFees>} FeeCalculationResult */

/**
 * Crea las funciones encargadas de renderizar la calculadora.
 *
 * @param {CalculatorElements} elements
 */
export const createCalculatorView = (
  elements
) => {
  const defaultPhoneHelp =
    elements.phoneHelp.textContent;

  const setHidden = (
    element,
    hidden
  ) => {
    element.hidden = hidden;
  };

  const renderSelection = (
    buttons,
    selectedValue,
    dataKey,
    activeClass
  ) => {
    buttons.forEach((button) => {
      const active =
        button.dataset[dataKey] ===
        selectedValue;

      button.classList.toggle(
        activeClass,
        active
      );

      button.setAttribute(
        'aria-pressed',
        String(active)
      );
    });
  };

  const renderMethod = (method) => {
    renderSelection(
      elements.methods,
      method,
      'method',
      'fee-calc__method--active'
    );
  };

  const renderSources = (source) => {
    renderSelection(
      elements.sources,
      source,
      'source',
      'fee-calc__source--active'
    );
  };

  const renderLead = (state) => {
    const showSaved =
      state.locked && !state.editing;

    setHidden(
      elements.leadBox,
      showSaved
    );

    setHidden(
      elements.savedBox,
      !showSaved
    );

    elements.savedPhone.textContent =
      `${COUNTRY_CODE} ${formatPhone(
        state.phone
      )}`;
  };

  const renderValidation = (state) => {
    const phoneError =
      !isValidBusinessPhone(state.phone) &&
      (
        state.attempted ||
        (
          state.phoneTouched &&
          state.phone.length > 0
        )
      );

    const amountError =
      state.attempted &&
      !isValidSaleAmount(state.amount);

    const methodError =
      state.attempted &&
      !isValidPaymentMethod(state.method);

    const consentError =
      state.attempted &&
      !state.terms;

    elements.phoneInput.setAttribute(
      'aria-invalid',
      String(phoneError)
    );

    elements.phoneHelp.classList.toggle(
      'fee-calc__message--error',
      phoneError
    );

    elements.phoneHelp.textContent =
      phoneError
        ? state.phone
          ? VALIDATION_MESSAGES.phoneInvalid
          : VALIDATION_MESSAGES.phoneEmpty
        : defaultPhoneHelp;

    elements.amountInput.setAttribute(
      'aria-invalid',
      String(amountError)
    );

    setHidden(
      elements.amountError,
      !amountError
    );

    setHidden(
      elements.methodError,
      !methodError
    );

    setHidden(
      elements.consentError,
      !consentError
    );
  };

  /** @param {FeeCalculationResult} result */
  const renderComparisonBadge = (
    result
  ) => {
    const nequiHasBetterRate =
      result.net > result.comparisonNet;

    setHidden(
      elements.nequiBadge,
      !nequiHasBetterRate
    );
  };

  /**
   * Renderiza el resultado correspondiente al escenario seleccionado.
   *
   * @param {Object} state
   * @param {FeeCalculationResult} result
   */
  const renderResult = (
    state,
    result
  ) => {
    const isCard =
      state.method === PAYMENT_METHODS.card;

    const scenarioKey =
      isCard
        ? PAYMENT_METHODS.card
        : state.source;

    const scenario =
      FEE_SCENARIOS[scenarioKey];

    const content =
      SCENARIO_CONTENT[scenarioKey];

    elements.resultSubtitle.textContent =
      content.subtitle;

    setHidden(
      elements.saleBlock,
      !isCard
    );

    setHidden(
      elements.cardDetail,
      !isCard
    );

    setHidden(
      elements.sourcesBox,
      isCard
    );

    setHidden(
      elements.linkDetail,
      isCard
    );

    elements.cardDetail.open = false;
    elements.linkDetail.open = false;

    renderSources(state.source);

    elements.saleOutput.textContent =
      formatCurrency(state.amount);

    elements.nequiNet.textContent =
      formatCurrency(result.net);

    elements.otherNet.textContent =
      formatCurrency(result.comparisonNet);

    renderComparisonBadge(result);

    if (isCard) {
      elements.cardFee.textContent =
        formatDiscount(result.fee);

      elements.cardTax.textContent =
        formatDiscount(result.tax);

      elements.cardWithholding.textContent =
        formatDiscount(result.withholding);

      elements.cardTotal.textContent =
        formatDiscount(result.discounts);

      return;
    }

    elements.linkNote.textContent =
      content.note;

    elements.linkSale.textContent =
      formatCurrency(state.amount);

    elements.linkFeeLabel.textContent =
      `Tarifa Wompi (${formatPercentage(
        scenario.nequiRate
      )})`;

    elements.linkFee.textContent =
      formatDiscount(result.fee);

    elements.linkTax.textContent =
      formatDiscount(result.tax);

    elements.linkTotal.textContent =
      formatDiscount(result.discounts);
  };

  /** @param {'form' | 'result'} view */
  const showView = (view) => {
    setHidden(
      elements.formView,
      view !== 'form'
    );

    setHidden(
      elements.resultView,
      view !== 'result'
    );
  };

  return {
    renderMethod,
    renderLead,
    renderValidation,
    renderResult,
    showView
  };
};