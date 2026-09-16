import {
  FX_INTEREST_LABELS
} from '../constants/fx.messages.js';

/**
 * @typedef {'COP' | 'USD'} FxCurrency
 */

/**
 * @typedef {'BUY' | 'SELL'} FxOperation
 */

/**
 * @typedef {Object} FxViewHandlers
 * @property {() => void} onAmountInput
 * @property {() => void} onPhoneInput
 * @property {() => void} onInterestsChange
 * @property {() => void} onConsentChange
 * @property {() => void} onSwap
 * @property {() => void} onConvert
 */

/**
 * @typedef {Object} FxResultView
 * @property {number} result
 * @property {FxCurrency} currencyTo
 * @property {string} operationLabel
 * @property {number} displayRate
 */

/**
 * @typedef {Object} FxSummaryView
 * @property {FxCurrency} currencyFrom
 * @property {FxCurrency} currencyTo
 * @property {number} amount
 * @property {string[]} interests
 */

export class FxView {
  /**
   * @param {HTMLElement} wrapper
   */
  constructor(wrapper) {
    this.wrapper = wrapper;

    this.amountInput =
      /** @type {HTMLInputElement | null} */ (
        wrapper.querySelector(
          '[data-fx="amount"]'
        )
      );

    this.currencyFrom =
      wrapper.querySelector(
        '[data-fx="currency-from"]'
      );

    this.currencyTo =
      wrapper.querySelector(
        '[data-fx="currency-to"]'
      );

    this.fromSymbol =
      wrapper.querySelector(
        '[data-fx="from-symbol"]'
      );

    this.toSymbol =
      wrapper.querySelector(
        '[data-fx="to-symbol"]'
      );

    this.previewResult =
      wrapper.querySelector(
        '[data-fx="preview-result"]'
      );

    this.direction =
      wrapper.querySelector(
        '[data-fx="direction"]'
      );

    this.conversionHelper =
      wrapper.querySelector(
        '[data-fx="conversion-helper"]'
      );

    this.convertButton =
      /** @type {HTMLButtonElement | null} */ (
        wrapper.querySelector(
          '[data-fx-action="convert"]'
        )
      );

    this.interests =
      /** @type {HTMLInputElement[]} */ (
        Array.from(
          wrapper.querySelectorAll(
            '[data-fx-interest]'
          )
        )
      );

    this.phone =
      /** @type {HTMLInputElement | null} */ (
        wrapper.querySelector(
          '[data-fx="phone"]'
        )
      );

    this.phoneStatus =
      wrapper.querySelector(
        '[data-fx="phone-status"]'
      );

    this.consent =
      /** @type {HTMLInputElement | null} */ (
        wrapper.querySelector(
          '[data-fx="data-consent"]'
        )
      );

    this.conversionResult =
      /** @type {HTMLElement | null} */ (
        wrapper.querySelector(
          '[data-fx="conversion-result"]'
        )
      );

    this.resultValue =
      wrapper.querySelector(
        '[data-fx="result-value"]'
      );

    this.resultRate =
      wrapper.querySelector(
        '[data-fx="result-rate"]'
      );

    this.headerRate =
      wrapper.querySelector(
        '[data-fx="header-rate"]'
      );

    this.headerRateMeta =
      wrapper.querySelector(
        '[data-fx="header-rate-meta"]'
      );

    this.selectionSummary =
      wrapper.querySelector(
        '[data-fx="selection-summary"]'
      );

  }

  /**
   * @param {FxViewHandlers} handlers
   */
  bindEvents(handlers) {
    this.wrapper.addEventListener(
      'input',
      (event) => {
        const target =
          /** @type {HTMLElement} */ (
            event.target
          );

        if (
          target.matches(
            '[data-fx="amount"]'
          )
        ) {
          handlers.onAmountInput();
          return;
        }

        if (
          target.matches(
            '[data-fx="phone"]'
          )
        ) {
          handlers.onPhoneInput();
        }
      }
    );

    this.wrapper.addEventListener(
      'change',
      (event) => {
        const target =
          /** @type {HTMLElement} */ (
            event.target
          );

        if (
          target.matches(
            '[data-fx-interest]'
          )
        ) {
          handlers.onInterestsChange();
          return;
        }

        if (
          target.matches(
            '[data-fx="data-consent"]'
          )
        ) {
          handlers.onConsentChange();
        }
      }
    );

    this.wrapper.addEventListener(
      'click',
      (event) => {
        const target =
          /** @type {HTMLElement} */ (
            event.target
          );

        const action =
          target.closest(
            '[data-fx-action]'
          );

        if (!action) {
          return;
        }

        const actionName =
          /** @type {HTMLElement} */ (
            action
          ).dataset.fxAction;

        if (
          actionName ===
          'swap'
        ) {
          handlers.onSwap();
          return;
        }

        if (
          actionName ===
          'convert'
        ) {
          handlers.onConvert();
        }
      }
    );
  }

  /**
   * @returns {string}
   */
  getPhone() {
    return this.onlyNumbers(
      this.phone?.value || ''
    );
  }

  /**
   * @returns {boolean}
   */
  getConsent() {
    return (
      this.consent?.checked ===
      true
    );
  }

  /**
   * @returns {string[]}
   */
  getSelectedInterests() {
    return this.interests
      .filter(
        (input) =>
          input.checked
      )
      .map(
        (input) =>
          input.value
      );
  }

  /**
   * @param {FxCurrency} currency
   * @returns {number}
   */
  normalizeAmountInput(currency) {
    if (!this.amountInput) {
      return 0;
    }

    const cleanValue =
      currency === 'COP'
        ? this.sanitizeCopAmount(
            this.amountInput.value
          )
        : this.sanitizeUsdAmount(
            this.amountInput.value
          );

    this.amountInput.value =
      currency === 'COP'
        ? this.formatCopInput(
            cleanValue
          )
        : this.formatUsdInput(
            cleanValue
          );

    return this.parseAmount(
      this.amountInput.value,
      currency
    );
  }

  /**
   * @returns {string}
   */
  normalizePhoneInput() {
    if (!this.phone) {
      return '';
    }

    const phone =
      this.onlyNumbers(
        this.phone.value
      ).slice(
        0,
        10
      );

    this.phone.value =
      this.formatPhone(
        phone
      );

    return phone;
  }

  /**
   * @param {FxCurrency} currency
   * @returns {number}
   */
  getAmount(currency) {
    return this.parseAmount(
      this.amountInput?.value || '',
      currency
    );
  }

  /**
   * @param {number} maxInterests
   */
  updateInterestAvailability(
    maxInterests
  ) {
    const selected =
      this.getSelectedInterests();

    const limitReached =
      selected.length >=
      maxInterests;

    this.interests.forEach(
      (input) => {
        input.disabled =
          !input.checked &&
          limitReached;
      }
    );
  }

  /**
   * @param {FxCurrency} currencyFrom
   * @param {FxCurrency} currencyTo
   */
  renderDirection(
    currencyFrom,
    currencyTo
  ) {
    if (this.currencyFrom) {
      this.currencyFrom.textContent =
        currencyFrom;
    }

    if (this.currencyTo) {
      this.currencyTo.textContent =
        currencyTo;
    }

    if (this.fromSymbol) {
      this.fromSymbol.textContent =
        currencyFrom === 'COP'
          ? '$'
          : 'US$';
    }

    if (this.toSymbol) {
      this.toSymbol.textContent =
        currencyTo === 'COP'
          ? '$'
          : 'US$';
    }

    if (this.direction) {
      this.direction.textContent =
        `${currencyFrom} → ${currencyTo}`;
    }

    if (this.amountInput) {
      this.amountInput.placeholder =
        currencyFrom === 'COP'
          ? '1.000.000'
          : '250,00';
    }
  }

  /**
   * @param {FxSummaryView} data
   */
  renderSummary(data) {
    if (!this.selectionSummary) {
      return;
    }

    const amountText =
      data.amount > 0
        ? `${
            data.currencyFrom ===
            'USD'
              ? 'US$'
              : '$'
          } ${
            this.formatMoney(
              data.amount,
              data.currencyFrom
            )
          }`
        : 'sin monto';

    const interestsText =
      data.interests.length
        ? ` · ${
            data.interests
              .map(
                (interest) =>
                  FX_INTEREST_LABELS[
                    interest
                  ] ||
                  interest
              )
              .join(', ')
          }`
        : '';

    this.selectionSummary.textContent =
      `${data.currencyFrom} → ${data.currencyTo} · ${amountText}${interestsText}`;
  }

  /**
   * @param {FxResultView} data
   */
  renderConversionResult(data) {
    if (this.previewResult) {
      this.previewResult.textContent =
        this.formatMoney(
          data.result,
          data.currencyTo
        );
    }

    if (this.resultValue) {
      this.resultValue.textContent =
        `${
          this.formatMoney(
            data.result,
            data.currencyTo
          )
        } ${data.currencyTo}`;
    }

    if (this.resultRate) {
      this.resultRate.textContent =
        `${data.operationLabel}: 1 USD ≈ ${
          this.formatRate(
            data.displayRate
          )
        } COP`;
    }

    if (this.conversionResult) {
      this.conversionResult.hidden =
        false;
    }

    if (this.headerRate) {
      this.headerRate.textContent =
        `1 USD ≈ ${
          this.formatRate(
            data.displayRate
          )
        } COP`;
    }

    if (this.headerRateMeta) {
      this.headerRateMeta.textContent =
        data.operationLabel;
    }

    if (this.conversionHelper) {
      this.conversionHelper.textContent =
        'Tasa consultada al momento de realizar la conversión.';
    }
  }

  /**
   * @param {string} operationLabel
   */
  clearConversionResult(
    operationLabel
  ) {
    if (this.previewResult) {
      this.previewResult.textContent =
        '—';
    }

    if (this.conversionResult) {
      this.conversionResult.hidden =
        true;
    }

    if (this.headerRate) {
      this.headerRate.textContent =
        'Consulte una conversión';
    }

    if (this.headerRateMeta) {
      this.headerRateMeta.textContent =
        operationLabel;
    }

    if (this.conversionHelper) {
      this.conversionHelper.textContent =
        'Ingresa un monto y consulta la tasa disponible.';
    }
  }

  clearAmount() {
    if (this.amountInput) {
      this.amountInput.value = '';
    }
  }

  /**
   * @param {string} phone
   */
  lockIdentity(phone) {
    if (this.phone) {
      this.phone.value =
        this.formatPhone(
          phone
        );

      this.phone.disabled =
        true;
    }

    if (this.consent) {
      this.consent.checked =
        true;

      this.consent.disabled =
        true;
    }

    this.phoneStatus
      ?.classList
      .add(
        'is-visible'
      );
  }

  /**
   * @param {boolean} loading
   * @param {FxOperation} operation
   */
  setLoading(
    loading,
    operation
  ) {
    if (!this.convertButton) {
      return;
    }

    if (loading) {
      this.convertButton.disabled =
        true;

      this.convertButton.textContent =
        operation === 'BUY'
          ? 'Consultando tasa de compra...'
          : 'Consultando tasa de venta...';

      return;
    }

    this.convertButton.disabled =
      false;

    this.convertButton.textContent =
      'Consultar conversión';
  }

  /**
   * @param {string} name
   * @param {string} message
   */
  showError(
    name,
    message
  ) {
    const element =
      this.getErrorElement(
        name
      );

    if (!element) {
      return;
    }

    element.textContent =
      message;

    element.hidden =
      false;
  }

  /**
   * @param {string} name
   */
  clearError(name) {
    const element =
      this.getErrorElement(
        name
      );

    if (!element) {
      return;
    }

    element.textContent = '';
    element.hidden = true;
  }

  clearAllErrors() {
    this.clearError('phone');
    this.clearError('consent');
    this.clearError('conversion');
    this.clearError('interest');
  }

  focusPhone() {
    this.phone?.focus();
  }

  focusAmount() {
    this.amountInput?.focus();
  }


  /**
   * @param {string} name
   * @returns {HTMLElement | null}
   */
  getErrorElement(name) {
    return /** @type {HTMLElement | null} */ (
      this.wrapper.querySelector(
        `[data-fx-error="${name}"]`
      )
    );
  }

  /**
   * @param {string} value
   * @returns {string}
   */
  onlyNumbers(value) {
    return String(
      value || ''
    ).replace(
      /\D/g,
      ''
    );
  }

  /**
   * @param {string} value
   * @returns {string}
   */
  sanitizeCopAmount(value) {
    return this.onlyNumbers(
      value
    );
  }

  /**
   * @param {string} value
   * @returns {string}
   */
  sanitizeUsdAmount(value) {
    let raw =
      String(
        value || ''
      )
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

    if (
      commaIndex === -1
    ) {
      return this.onlyNumbers(
        raw
      );
    }

    const integerPart =
      this.onlyNumbers(
        raw.slice(
          0,
          commaIndex
        )
      );

    const decimalPart =
      this.onlyNumbers(
        raw.slice(
          commaIndex + 1
        )
      ).slice(
        0,
        2
      );

    return (
      `${integerPart},${decimalPart}`
    );
  }

  /**
   * @param {string} value
   * @param {FxCurrency} currency
   * @returns {number}
   */
  parseAmount(
    value,
    currency
  ) {
    if (!value) {
      return 0;
    }

    if (
      currency === 'COP'
    ) {
      const number =
        Number(
          this.onlyNumbers(
            value
          )
        );

      return Number.isFinite(
        number
      )
        ? number
        : 0;
    }

    const normalized =
      String(
        value
      )
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

    const number =
      Number(
        normalized
      );

    return Number.isFinite(
      number
    )
      ? number
      : 0;
  }

  /**
   * @param {string} value
   * @returns {string}
   */
  formatCopInput(value) {
    const digits =
      this.onlyNumbers(
        value
      );

    if (!digits) {
      return '';
    }

    return new Intl.NumberFormat(
      'es-CO',
      {
        maximumFractionDigits:
          0
      }
    ).format(
      Number(
        digits
      )
    );
  }

  /**
   * @param {string} value
   * @returns {string}
   */
  formatUsdInput(value) {
    if (!value) {
      return '';
    }

    const normalized =
      String(
        value
      );

    const hasComma =
      normalized.includes(',');

    const parts =
      normalized.split(',');

    const integerDigits =
      this.onlyNumbers(
        parts[0]
      );

    const integerFormatted =
      new Intl.NumberFormat(
        'es-CO',
        {
          maximumFractionDigits:
            0
        }
      ).format(
        Number(
          integerDigits || '0'
        )
      );

    if (!hasComma) {
      return integerFormatted;
    }

    const decimals =
      this.onlyNumbers(
        parts[1] || ''
      ).slice(
        0,
        2
      );

    return (
      `${integerFormatted},${decimals}`
    );
  }

  /**
   * @param {number} value
   * @param {FxCurrency} currency
   * @returns {string}
   */
  formatMoney(
    value,
    currency
  ) {
    if (
      !Number.isFinite(
        value
      )
    ) {
      return '—';
    }

    return new Intl.NumberFormat(
      'es-CO',
      {
        minimumFractionDigits:
          currency === 'USD'
            ? 2
            : 0,

        maximumFractionDigits:
          currency === 'USD'
            ? 2
            : 0
      }
    ).format(
      value
    );
  }

  /**
   * @param {number} value
   * @returns {string}
   */
  formatRate(value) {
    return new Intl.NumberFormat(
      'es-CO',
      {
        minimumFractionDigits:
          2,

        maximumFractionDigits:
          4
      }
    ).format(
      value
    );
  }

  /**
   * @param {string} value
   * @returns {string}
   */
  formatPhone(value) {
    const digits =
      this.onlyNumbers(
        value
      ).slice(
        0,
        10
      );

    return [
      digits.slice(0, 3),
      digits.slice(3, 6),
      digits.slice(6, 10)
    ]
      .filter(Boolean)
      .join(' ');
  }
}