import {
  FX_CONFIG
} from '../constants/fx.constants.js';

import {
  FX_MESSAGES,
  FX_OPERATION_LABELS
} from '../constants/fx.messages.js';

import {
  mapFxConversionRequest
} from '../services/fx-request.mapper.js';

import {
  FxService,
  FxServiceError
} from '../services/fx.service.js';

import {
  validateFxConversion
} from '../validators/fx.validation.js';

import {
  FxConverterViewModel
} from '../view-models/fx-converter.view-model.js';

import {
  FxView
} from '../views/fx.view.js';

/**
 * @typedef {Object} FxRuntimeConfig
 * @property {string} webhookUrl
 */

export class FxController {
  constructor() {
    /** @type {FxView | null} */
    this.view = null;

    /** @type {FxConverterViewModel | null} */
    this.viewModel = null;

    /** @type {FxService | null} */
    this.service = null;
  }

  init() {
    const wrapper =
      /** @type {HTMLElement | null} */ (
        document.querySelector(
          '[data-fx="wrapper"]'
        )
      );

    if (!wrapper) {
      return;
    }

    if (
      wrapper.dataset.fxInitialized ===
      'true'
    ) {
      return;
    }

    const config =
      /** @type {Window & {
       *   FX_CONFIG?: FxRuntimeConfig
       * }} */ (
        window
      ).FX_CONFIG;

    if (!config?.webhookUrl) {
      throw new Error(
        'FX_WEBHOOK_NOT_CONFIGURED'
      );
    }

    this.view =
      new FxView(wrapper);

    this.viewModel =
      new FxConverterViewModel();

    this.service =
      new FxService({
        webhookUrl:
          config.webhookUrl
      });

    this.bindEvents();

    this.view
      .updateInterestAvailability(
        FX_CONFIG.MAX_INTERESTS
      );

    this.renderDirection();
    this.renderSummary();
    this.clearConversionResult();

    wrapper.dataset.fxInitialized =
      'true';
  }

  bindEvents() {
    this.view.bindEvents({
      onAmountInput:
        () =>
          this.handleAmountInput(),

      onPhoneInput:
        () =>
          this.handlePhoneInput(),

      onInterestsChange:
        () =>
          this.handleInterestsChange(),

      onConsentChange:
        () =>
          this.handleConsentChange(),

      onSwap:
        () =>
          this.handleSwap(),

      onConvert:
        () =>
          this.handleConversion()
    });
  }

  handleAmountInput() {
    const amount =
      this.view.normalizeAmountInput(
        this.viewModel.currencyFrom
      );

    this.viewModel.setAmount(
      amount
    );

    this.view.clearError(
      'conversion'
    );

    this.clearConversionResult();
    this.renderSummary();
  }

  handlePhoneInput() {
    if (
      this.viewModel.identified
    ) {
      return;
    }

    const phone =
      this.view
        .normalizePhoneInput();

    this.viewModel.setIdentity(
      phone,
      this.viewModel.consent
    );

    this.view.clearError(
      'phone'
    );
  }

  handleInterestsChange() {
    const interests =
      this.view
        .getSelectedInterests();

    this.viewModel.setInterests(
      interests
    );

    this.view
      .updateInterestAvailability(
        FX_CONFIG.MAX_INTERESTS
      );

    this.view.clearError(
      'interest'
    );

    this.clearConversionResult();
    this.renderSummary();
  }

  handleConsentChange() {
    if (
      this.viewModel.identified
    ) {
      return;
    }

    this.viewModel.setIdentity(
      this.viewModel.phone,
      this.view.getConsent()
    );

    this.view.clearError(
      'consent'
    );
  }

  handleSwap() {
    const currencyFrom =
      this.viewModel.currencyTo;

    const currencyTo =
      this.viewModel.currencyFrom;

    this.viewModel
      .setCurrencies(
        currencyFrom,
        currencyTo
      );

    this.viewModel.setAmount(0);

    this.view.clearAmount();

    this.clearConversionResult();
    this.renderDirection();
    this.renderSummary();
  }

  async handleConversion() {
    this.syncFormState();

    const validation =
      validateFxConversion({
        phone:
          this.viewModel.phone,

        consent:
          this.viewModel.consent,

        amount:
          this.viewModel.amount,

        currencyFrom:
          this.viewModel.currencyFrom,

        currencyTo:
          this.viewModel.currencyTo,

        interests:
          this.viewModel.interests
      });

    if (!validation.valid) {
      this.handleValidationError(
        validation.error
      );

      return;
    }

    const operation =
      this.viewModel
        .getOperation();

    this.view.setLoading(
      true,
      operation
    );

    try {
      const payload =
        mapFxConversionRequest(
          this.viewModel
        );

      const response =
        await this.service
          .requestConversion(
            payload
          );

      const conversion =
        response.conversion;

      const rate =
        Number(
          conversion?.rate
        );

      const result =
        Number(
          conversion?.result
        );

      if (
        !conversion ||
        !Number.isFinite(rate) ||
        !Number.isFinite(result)
      ) {
        throw new Error(
          'INVALID_CONVERSION_RESPONSE'
        );
      }

      this.viewModel
        .setConversionResult({
          rate,
          result,
          updatedAt:
            conversion.updatedAt ??
            null,
          quoteMaxInterval:
            conversion
              .quoteMaxInterval ??
            null
        });

      if (
        !this.viewModel.identified
      ) {
        this.viewModel
          .lockIdentity();

        this.view.lockIdentity(
          this.viewModel.phone
        );
      }

      this.renderConversionResult();
    } catch (error) {
      this.handleRequestError(
        error
      );
    } finally {
      this.view.setLoading(
        false,
        operation
      );
    }
  }

  syncFormState() {
    if (
      !this.viewModel.identified
    ) {
      this.viewModel.setIdentity(
        this.view.getPhone(),
        this.view.getConsent()
      );
    }

    this.viewModel.setAmount(
      this.view.getAmount(
        this.viewModel.currencyFrom
      )
    );

    this.viewModel.setInterests(
      this.view
        .getSelectedInterests()
    );

    this.view.clearAllErrors();
  }

  renderDirection() {
    this.view.renderDirection(
      this.viewModel.currencyFrom,
      this.viewModel.currencyTo
    );
  }

  renderSummary() {
    this.view.renderSummary({
      currencyFrom:
        this.viewModel.currencyFrom,

      currencyTo:
        this.viewModel.currencyTo,

      amount:
        this.viewModel.amount,

      interests:
        this.viewModel.interests
    });
  }

  renderConversionResult() {
    const displayRate =
      this.viewModel
        .getDisplayRate();

    if (
      !Number.isFinite(
        displayRate
      )
    ) {
      return;
    }

    const operation =
      this.viewModel
        .getOperation();

    this.view
      .renderConversionResult({
        result:
          this.viewModel.result,

        currencyTo:
          this.viewModel.currencyTo,

        operationLabel:
          FX_OPERATION_LABELS[
            operation
          ],

        displayRate
      });
  }

  clearConversionResult() {
    this.viewModel
      .clearConversionResult();

    this.view
      .clearConversionResult();
  }

  /**
   * @param {string | null} error
   */
  handleValidationError(
    error
  ) {
    switch (error) {
      case 'INVALID_PHONE':
        this.view.showError(
          'phone',
          FX_MESSAGES.INVALID_PHONE
        );

        this.view.focusPhone();
        break;

      case 'CONSENT_REQUIRED':
        this.view.showError(
          'consent',
          FX_MESSAGES.CONSENT_REQUIRED
        );
        break;

      case 'INVALID_AMOUNT':
        this.view.showError(
          'conversion',
          FX_MESSAGES.INVALID_AMOUNT
        );

        this.view.focusAmount();
        break;

      case 'MAX_INTERESTS':
        this.view.showError(
          'interest',
          FX_MESSAGES.MAX_INTERESTS
        );
        break;

      case 'INVALID_CURRENCY_PAIR':
        this.view.showError(
          'conversion',
          FX_MESSAGES
            .UNSUPPORTED_CONVERSION
        );
        break;

      default:
        this.view.showError(
          'conversion',
          FX_MESSAGES.GENERIC_ERROR
        );
    }
  }

  /**
   * @param {unknown} error
   */
  handleRequestError(
    error
  ) {
    if (
      !(error instanceof
        FxServiceError)
    ) {
      this.view.showError(
        'conversion',
        FX_MESSAGES.GENERIC_ERROR
      );

      return;
    }

    let message =
      FX_MESSAGES.GENERIC_ERROR;

    switch (error.status) {
      case 400:
        message =
          FX_MESSAGES.INVALID_REQUEST;
        break;

      case 422:
        message =
          FX_MESSAGES
            .UNSUPPORTED_CONVERSION;
        break;

      case 429:
        message =
          FX_MESSAGES.RATE_LIMIT;
        break;

      case 500:
      case 503:
        message =
          FX_MESSAGES.RATE_UNAVAILABLE;
        break;

      default:
        break;
    }

    this.view.showError(
      'conversion',
      message
    );
  }
}