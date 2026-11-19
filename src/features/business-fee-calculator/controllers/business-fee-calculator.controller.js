import {
  MOBILE_CTA,
  PAYMENT_METHODS,
  PAYMENT_SOURCES,
  SIMULATE_EVENT
} from '../constants/business-fee-calculator.constants.js';

import {
  calculateFees
} from '../services/fee-calculation.service.js';

import {
  readLeadSession,
  saveLeadSession
} from '../services/session.service.js';

import {
  sendMobileCtaEvent,
  sendSimulationEvent
} from '../services/analytics.service.js';

import {
  isValidBusinessPhone,
  isValidPaymentMethod,
  isValidSaleAmount
} from '../validators/business-fee-calculator.validator.js';

import {
  formatSaleAmountInput,
  normalizeBusinessPhone,
  normalizeSaleAmount
} from '../view-models/business-fee-calculator.view-model.js';

import {
  formatPhone
} from '../../../shared/utils/formatters/phone.formatter.js';

import {
  getCalculatorElements
} from '../views/business-fee-calculator.elements.js';

import {
  createCalculatorView
} from '../views/business-fee-calculator.view.js';

/**
 * Inicializa la calculadora dentro de su elemento raíz.
 *
 * @param {HTMLElement} root
 * @returns {void}
 */
export const initBusinessFeeCalculator = (
  root
) => {
  const elements =
    getCalculatorElements(root);

  const view =
    createCalculatorView(elements);

  const savedLead =
    readLeadSession();

  const state = {
    amount: 0,
    method: '',
    source: PAYMENT_SOURCES.nequi,
    phone: savedLead?.phone ?? '',
    terms: savedLead?.terms ?? false,
    locked: Boolean(savedLead),
    editing: false,
    attempted: false,
    phoneTouched: false,
    runs: 0
  };

  if (savedLead) {
    elements.phoneInput.value =
      formatPhone(state.phone);

    elements.consentInput.checked =
      true;
  }

  const getScenarioKey = () => {
    return state.method === PAYMENT_METHODS.card
      ? PAYMENT_METHODS.card
      : state.source;
  };

  const getResult = () => {
    return calculateFees(
      state.amount,
      getScenarioKey()
    );
  };

  const renderForm = () => {
    view.renderMethod(state.method);
    view.renderLead(state);
    view.renderValidation(state);
  };

  const getFirstInvalidField = () => {
    if (!isValidPaymentMethod(state.method)) {
      return elements.methods[0];
    }

    if (!isValidSaleAmount(state.amount)) {
      return elements.amountInput;
    }

    if (!isValidBusinessPhone(state.phone)) {
      return elements.phoneInput;
    }

    if (!state.terms) {
      return elements.consentInput;
    }

    return null;
  };

  const simulate = () => {
    state.attempted = true;
    view.renderValidation(state);

    const invalidField =
      getFirstInvalidField();

    if (invalidField) {
      invalidField.focus();
      return;
    }

    state.locked = true;
    state.editing = false;
    state.attempted = false;
    state.runs += 1;

    saveLeadSession(state.phone);

    const scenarioKey =
      getScenarioKey();

    const result =
      getResult();

    renderForm();
    view.renderResult(state, result);
    view.showView('result');

    elements.resultTitle.focus();

    elements.root.dispatchEvent(
      new CustomEvent(
        SIMULATE_EVENT,
        {
          bubbles: true,
          detail: {
            amount: state.amount,
            method: state.method,
            source:
              state.method === PAYMENT_METHODS.link
                ? state.source
                : null,
            fee: result.fee,
            tax: result.tax,
            withholding: result.withholding,
            net: result.net,
            run: state.runs
          }
        }
      )
    );

    sendSimulationEvent({
      phone: state.phone,
      amount: state.amount,
      method: state.method,
      source: state.source,
      scenarioKey,
      result
    });
  };

  elements.methods.forEach((button) => {
    button.addEventListener(
      'click',
      () => {
        state.method =
          button.dataset.method;

        view.renderMethod(state.method);
        view.renderValidation(state);
      }
    );
  });

  elements.sources.forEach((button) => {
    button.addEventListener(
      'click',
      () => {
        state.source =
          button.dataset.source;

        view.renderResult(
          state,
          getResult()
        );
      }
    );
  });

  elements.amountInput.addEventListener(
    'input',
    () => {
      state.amount =
        normalizeSaleAmount(
          elements.amountInput.value
        );

      elements.amountInput.value =
        formatSaleAmountInput(
          state.amount
        );

      view.renderValidation(state);
    }
  );

  elements.phoneInput.addEventListener(
    'input',
    () => {
      state.phone =
        normalizeBusinessPhone(
          elements.phoneInput.value
        );

      elements.phoneInput.value =
        formatPhone(state.phone);

      view.renderValidation(state);
    }
  );

  elements.phoneInput.addEventListener(
    'blur',
    () => {
      state.phoneTouched = true;
      view.renderValidation(state);
    }
  );

  elements.consentInput.addEventListener(
    'change',
    () => {
      state.terms =
        elements.consentInput.checked;

      view.renderValidation(state);
    }
  );

  elements.editButton.addEventListener(
    'click',
    () => {
      state.editing = true;
      view.renderLead(state);
      elements.phoneInput.focus();
    }
  );

  elements.submitButton.addEventListener(
    'click',
    simulate
  );

  elements.backButton.addEventListener(
    'click',
    () => {
      view.showView('form');
      elements.amountInput.focus();
    }
  );

  elements.mobileCtas.forEach((button) => {
    button.addEventListener(
      'click',
      () => {
        const ctaName =
          button.id === 'fee-calc-cta-get-nequi-business'
            ? MOBILE_CTA.getNequiBusiness
            : MOBILE_CTA.startCollecting;

        sendMobileCtaEvent({
          phone: state.phone,
          amount: state.amount,
          method: state.method,
          source: state.source,
          scenarioKey: getScenarioKey(),
          ctaName
        });
      }
    );
  });

  renderForm();
  view.showView('form');
};