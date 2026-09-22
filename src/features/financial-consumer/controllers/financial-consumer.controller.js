import {
  FINANCIAL_CONSUMER_IDS,
  FINANCIAL_CONSUMER_NAMES,
  FINANCIAL_CONSUMER_VALUES,
  FINANCIAL_CONSUMER_LIMITS,
} from "../constants/financial-consumer.constants.js";

import {
  FINANCIAL_CONSUMER_MESSAGES,
} from "../constants/financial-consumer.messages.js";

import {
  getDepartments,
  getCities,
} from "../services/location.service.js";

import {
  sanitizeDigits,
  isValidPhoneNumber,
  isValidDocumentNumber,
  isValidEmail,
  isValidFileSize,
} from "../validators/financial-consumer.validator.js";

import {
  getTodayIsoDate,
  formatSubmissionDate,
  normalizeAmount,
  formatAmount,
} from "../view-models/financial-consumer.view-model.js";

import {
  FinancialConsumerView,
} from "../views/financial-consumer.view.js";

export class FinancialConsumerController {
  constructor() {
    /** @type {FinancialConsumerView} */
    this.view = new FinancialConsumerView();

    /** @type {HTMLInputElement | null} */
    this.submissionDateHiddenInput = null;

    /** @type {HTMLInputElement | null} */
    this.amountHiddenInput = null;
  }

  /**
   * Inicializa el comportamiento del formulario.
   *
   * @returns {Promise<void>}
   */
  async init() {
    this.setupSubmissionDate();
    this.setupAmount();
    this.setupDocumentNumber();
    this.setupEmail();
    this.setupPhoneNumber();
    this.setupTextCounters();
    this.setupConditionalFields();
    this.setupFileInputs();
    this.setupLocationListeners();

    await this.loadDepartments();

    this.view.renderCities();
  }

  /**
   * Configura la fecha actual y prepara el valor
   * que se enviará al formulario.
   *
   * @returns {void}
   */
  setupSubmissionDate() {
    const input = this.view.submissionDateInput;

    if (!input) return;

    const today = getTodayIsoDate();

    this.view.setSubmissionDate(today);

    this.submissionDateHiddenInput =
      this.view.createHiddenField({
        sourceInput: input,
        name: FINANCIAL_CONSUMER_NAMES.submissionDate,
      });

    this.syncSubmissionDate();

    input.addEventListener("change", () => {
      this.syncSubmissionDate();
    });
  }

  /**
   * Sincroniza la fecha visible con el valor
   * DD/MM/AAAA enviado al formulario.
   *
   * @returns {void}
   */
  syncSubmissionDate() {
    if (
      !this.submissionDateHiddenInput ||
      !this.view.submissionDateInput
    ) {
      return;
    }

    this.submissionDateHiddenInput.value =
      formatSubmissionDate(
        this.view.submissionDateInput.value
      );
  }

  /**
   * Configura el formato visual y valor normalizado
   * del monto de reclamación.
   *
   * @returns {void}
   */
  setupAmount() {
    const input = this.view.amountInput;

    if (!input) return;

    this.amountHiddenInput =
      this.view.createHiddenField({
        sourceInput: input,
        name: FINANCIAL_CONSUMER_NAMES.amount,
      });

    const updateAmount = () => {
      const normalizedAmount =
        normalizeAmount(input.value);

      input.value =
        formatAmount(normalizedAmount);

      if (this.amountHiddenInput) {
        this.amountHiddenInput.value =
          normalizedAmount;
      }
    };

    input.addEventListener(
      "input",
      updateAmount
    );

    updateAmount();
  }

  /**
   * Configura validación y sanitización
   * del número de documento.
   *
   * @returns {void}
   */
  setupDocumentNumber() {
    const input =
      this.view.documentNumberInput;

    if (!input) return;

    input.addEventListener("input", () => {
      input.value = sanitizeDigits(
        input.value
      ).slice(
        0,
        FINANCIAL_CONSUMER_LIMITS.documentNumber
      );

      const isValid =
        !input.value ||
        isValidDocumentNumber(
          input.value,
          FINANCIAL_CONSUMER_LIMITS.documentNumber
        );

      this.view.setValidity(
        input,
        isValid
          ? ""
          : FINANCIAL_CONSUMER_MESSAGES.invalidDocument
      );
    });
  }

  /**
   * Configura la validación del correo electrónico.
   *
   * @returns {void}
   */
  setupEmail() {
    const input = this.view.emailInput;

    if (!input) return;

    input.addEventListener("input", () => {
      const isValid =
        !input.value ||
        isValidEmail(input.value);

      this.view.setValidity(
        input,
        isValid
          ? ""
          : FINANCIAL_CONSUMER_MESSAGES.invalidEmail
      );
    });
  }

  /**
   * Configura la validación y sanitización
   * del número celular.
   *
   * @returns {void}
   */
  setupPhoneNumber() {
    const input =
      this.view.phoneNumberInput;

    if (!input) return;

    input.addEventListener("input", () => {
      input.value = sanitizeDigits(
        input.value
      ).slice(
        0,
        FINANCIAL_CONSUMER_LIMITS.phoneNumber
      );

      const isValid =
        !input.value ||
        isValidPhoneNumber(
          input.value,
          FINANCIAL_CONSUMER_LIMITS.phoneNumber
        );

      this.view.setValidity(
        input,
        isValid
          ? ""
          : FINANCIAL_CONSUMER_MESSAGES.invalidPhone
      );
    });
  }

  /**
   * Configura los contadores de caracteres
   * para los campos de texto extensos.
   *
   * @returns {void}
   */
  setupTextCounters() {
    this.view.setupCounter({
      textarea:
        this.view.caseDescriptionInput,
      counterId:
        FINANCIAL_CONSUMER_IDS
          .caseDescriptionCounter,
      maxCharacters:
        FINANCIAL_CONSUMER_LIMITS
          .caseDescription,
    });

    this.view.setupCounter({
      textarea:
        this.view.specificRequestInput,
      counterId:
        FINANCIAL_CONSUMER_IDS
          .specificRequestCounter,
      maxCharacters:
        FINANCIAL_CONSUMER_LIMITS
          .specificRequest,
    });
  }

  /**
   * Configura los campos condicionales
   * de otro producto y otro servicio.
   *
   * @returns {void}
   */
  setupConditionalFields() {
    const syncProductField = () => {
      const shouldShow =
        this.view.getSelectedProduct() ===
        FINANCIAL_CONSUMER_VALUES.otherProduct;

      this.view.toggleOtherProduct(
        shouldShow
      );
    };

    const syncServiceField = () => {
      const shouldShow =
        this.view.getSelectedService() ===
        FINANCIAL_CONSUMER_VALUES.otherService;

      this.view.toggleOtherService(
        shouldShow
      );
    };

    this.view.productRadios.forEach(
      (radio) => {
        radio.addEventListener(
          "change",
          syncProductField
        );
      }
    );

    this.view.serviceRadios.forEach(
      (radio) => {
        radio.addEventListener(
          "change",
          syncServiceField
        );
      }
    );

    syncProductField();
    syncServiceField();
  }

  /**

   * @returns {void}
   */
  setupFileInputs() {
    this.view.fileInputs.forEach(
      (input) => {
        input.addEventListener(
          "change",
          () => {
            const file =
              input.files?.[0];

            const isValid =
              isValidFileSize(
                file,
                FINANCIAL_CONSUMER_LIMITS
                  .maxFileSize
              );

            this.view.setValidity(
              input,
              isValid
                ? ""
                : FINANCIAL_CONSUMER_MESSAGES
                    .fileTooLarge
            );

            if (!isValid) {
              this.view.showValidity(input);
              input.value = "";
            }
          }
        );
      }
    );
  }

  /**
   * Configura el listener de cambio
   * del departamento.
   *
   * @returns {void}
   */
  setupLocationListeners() {
    this.view.departmentSelect?.addEventListener(
      "change",
      () => {
        void this.handleDepartmentChange();
      }
    );
  }

  /**
   * Obtiene y renderiza los departamentos.
   *
   * @returns {Promise<void>}
   */
  async loadDepartments() {
    try {
      const departments =
        await getDepartments();

      this.view.renderDepartments(
        departments
      );
    } catch (error) {
      console.error(
        FINANCIAL_CONSUMER_MESSAGES
          .departmentsError,
        error
      );
    }
  }

  /**
   * Obtiene y renderiza las ciudades
   * correspondientes al departamento seleccionado.
   *
   * @returns {Promise<void>}
   */
  async handleDepartmentChange() {
    const departmentKey =
      this.view.getSelectedDepartmentKey();

    if (!departmentKey) {
      this.view.renderCities();
      return;
    }

    try {
      const cities =
        await getCities(
          departmentKey
        );

      this.view.renderCities(cities);
    } catch (error) {
      console.error(
        FINANCIAL_CONSUMER_MESSAGES
          .citiesError,
        error
      );

      this.view.renderCities();
    }
  }
}