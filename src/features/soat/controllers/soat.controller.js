import { SoatView } from '../views/soat.view.js';
import { validateSoatForm } from '../validators/soat.validation.js';
import { requestSoatQuote } from '../services/soat.service.js';
import { SOAT_MESSAGES } from '../constants/soat.messages.js';
import { buildSoatQuotePayload } from '../view-models/soat-form.view-model.js';
import {
  createMosparoInstance,
  getMosparoTokens
} from '../services/soat.mosparo.service.js';

export class SoatController {
  constructor() {
    this.view = new SoatView();
    this.mosparoInstance = null;
  }

  /**
   * Valida si existe el formulario SOAT en la página.
   *
   * @returns {boolean}
   */
  hasForm() {
    return this.view.hasForm();
  }

  /**
   * Inicializa Mosparo.
   *
   * @returns {Promise<void>}
   */
  async #initMosparo() {
    try {
      this.mosparoInstance = await createMosparoInstance();
    } catch (error) {
      this.view.showMessage(SOAT_MESSAGES.MOSPARO_LOAD_ERROR, 'error');
    }
  }

  /**
   * Marca en la vista los campos con errores de validación.
   *
   * @param {Record<string, string>} errors
   * @returns {void}
   */
  #showValidationErrors(errors) {
    Object.keys(errors).forEach((fieldName) => {
      this.view.markFieldError(fieldName);
    });
  }

  /**
   * Envía la homologación seleccionada y renderiza la cotización final.
   *
   * @param {string} quotePublicId
   * @param {string} vehicleTypeId
   * @param {boolean} withAP
   * @returns {Promise<void>}
   */
  async #handleHomologationSelection(quotePublicId, vehicleTypeId, withAP) {
    this.view.showHomologationLoading();

    try {
      const payload = {
        action: 'select-homologation',
        quotePublicId,
        vehicleTypeId,
        withAP
      };

      const result = await requestSoatQuote(payload);

      if (!result.success) {
        throw new Error(
          result.message || SOAT_MESSAGES.HOMOLOGATION_UPDATE_ERROR
        );
      }

      this.view.hideHomologationOptions();
      this.view.renderResult(result.data, withAP);
      this.view.showMessage(
        result.message || SOAT_MESSAGES.QUOTE_SUCCESS,
        'success'
      );
    } catch (error) {
      this.view.hideHomologationOptions();
      this.view.showPrimaryAction();
      this.view.showResult();

      this.view.showMessage(
        error.message || SOAT_MESSAGES.HOMOLOGATION_UPDATE_ERROR,
        'error'
      );
    }
  }

  /**
   * Maneja el envío del formulario de cotización SOAT.
   *
   * @param {SubmitEvent} event
   * @returns {Promise<void>}
   */
  async handleSubmit(event) {
    event.preventDefault();

    this.view.showMessage('');
    this.view.clearFieldErrors();
    this.view.resetResult();
    this.view.showExtraMessage('');

    const formData = this.view.getFormData();
    const validationResult = validateSoatForm(formData);

    if (!validationResult.isValid) {
      this.#showValidationErrors(validationResult.errors);

      const firstErrorMessage = Object.values(validationResult.errors)[0];

      this.view.showMessage(
        firstErrorMessage || SOAT_MESSAGES.FORM_INVALID,
        'error'
      );

      return;
    }

    const { submitToken, validationToken } = getMosparoTokens(
      this.view.dom.form
    );

    if (!submitToken || !validationToken) {
      this.view.showMessage(SOAT_MESSAGES.SECURITY_REQUIRED, 'error');
      return;
    }

   const payload = buildSoatQuotePayload(this.view.dom.form, formData, {
     submitToken,
     validationToken
});

    this.view.setLoading(true);

    try {
      const result = await requestSoatQuote(payload);

      if (result.requiresHomologationSelection) {
        this.view.showMessage('');

        this.view.renderHomologationOptions(
          result.data?.homologateOptions || [],
          (selectedOption) => {
            this.#handleHomologationSelection(
              result.quotePublicId,
              selectedOption.vehicleTypeId,
              formData.withAP
            );
          }
        );

        return;
      }

      this.view.renderResult(result.data, formData.withAP);
      this.view.showMessage(
        result.message || SOAT_MESSAGES.QUOTE_SUCCESS,
        'success'
      );
    } catch (error) {
      const isNetworkError =
        error.message === 'Load failed' ||
        error.message === 'Failed to fetch';

      this.view.showMessage(
        isNetworkError
          ? SOAT_MESSAGES.NETWORK_ERROR
          : error.message || SOAT_MESSAGES.QUOTE_ERROR,
        'error'
      );

      if (error.data?.endDate) {
        this.view.showExtraMessage(
          `${SOAT_MESSAGES.EXPIRATION_DATE} ${this.view.formatLongDate(error.data.endDate)}.`
        );
      }

      this.mosparoInstance?.reset?.();
    } finally {
      this.view.setLoading(false);
    }
  }

  /**
   * Inicializa los listeners y comportamientos del simulador SOAT.
   *
   * @returns {void}
   */
  init() {
    if (!this.hasForm()) return;

    this.#initMosparo();
    this.view.initInputFormatting();
    this.view.initFloatingLabels();
    this.view.onSubmit(this.handleSubmit.bind(this));
  }
}