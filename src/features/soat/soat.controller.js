import { APP_CONFIG } from '../../shared/config/app.config.js';
import { SoatView } from './soat.view.js';
import { validateSoatForm } from './soat.validation.js';
import { requestSoatQuote } from './soat.service.js';

export class SoatController {
  constructor() {
    this.view = new SoatView();
    this.mosparoInstance = null;
  }

  hasForm() {
    return this.view.hasForm();
  }

  waitForMosparo(maxAttempts = 40, delay = 250) {
    return new Promise((resolve, reject) => {
      let attempts = 0;

      const check = () => {
        attempts += 1;

        if (window.mosparo) {
          resolve(window.mosparo);
          return;
        }

        if (attempts >= maxAttempts) {
          reject(new Error('Mosparo no cargó a tiempo.'));
          return;
        }

        setTimeout(check, delay);
      };

      check();
    });
  }

  async initMosparo() {
    try {
      const Mosparo = await this.waitForMosparo();

      this.mosparoInstance = new Mosparo(
        'mosparo-box',
        APP_CONFIG.mosparo.host,
        APP_CONFIG.mosparo.uuid,
        APP_CONFIG.mosparo.publicKey,
        { designMode: false }
      );
    } catch (error) {
      this.view.showMessage(
        'No fue posible cargar la validación de seguridad.',
        'error'
      );
    }
  }

  getMosparoTokens() {
    const formElement = this.view.dom.form;

    const submitToken =
      formElement?.querySelector('[name="_mosparo_submitToken"]')?.value || '';

    const validationToken =
      formElement?.querySelector('[name="_mosparo_validationToken"]')?.value || '';

    return {
      submitToken,
      validationToken
    };
  }

  showValidationErrors(errors) {
    Object.keys(errors).forEach((fieldName) => {
      this.view.markFieldError(fieldName);
    });
  }

  async handleSubmit(event) {
    event.preventDefault();

    this.view.showMessage('');
    this.view.clearFieldErrors();
    this.view.resetResult();

    const formData = this.view.getFormData();
    const validationResult = validateSoatForm(formData);

    if (!validationResult.isValid) {
      this.showValidationErrors(validationResult.errors);
      this.view.showMessage(
        'Por favor, completa correctamente los campos.',
        'error'
      );
      return;
    }

    const { submitToken, validationToken } = this.getMosparoTokens();

    if (!submitToken || !validationToken) {
      this.view.showMessage(
        'Completa la validación de seguridad.',
        'error'
      );
      return;
    }

    const payload = {
      formData: {
        ...Object.fromEntries(new FormData(this.view.dom.form).entries()),
        _mosparo_submitToken: submitToken,
        _mosparo_validationToken: validationToken
      }
    };

    this.view.setLoading(true);

    try {
      const result = await requestSoatQuote(payload);

      this.view.renderResult(result.data);
      this.view.showMessage(
        result.message || 'Cotización exitosa.',
        'success'
      );
    } catch (error) {
      this.view.showMessage(
        error.message || 'No fue posible realizar la cotización.',
        'error'
      );

      this.mosparoInstance?.reset?.();
    } finally {
      this.view.setLoading(false);
    }
  }

  init() {
    if (!this.hasForm()) return;

    this.initMosparo();
    this.view.initInputFormatting();
    this.view.initFloatingLabels();
    this.view.onSubmit(this.handleSubmit.bind(this));
  }
}