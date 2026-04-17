import { SoatView } from '../views/soat.view.js';
import { validateSoatForm } from '../validators/soat.validation.js';
import { requestSoatQuote } from '../services/soat.service.js';
import {
  createMosparoInstance,
  getMosparoTokens
} from '../services/soat.mosparo.service.js';

export class SoatController {
  constructor() {
    this.view = new SoatView();
    this.mosparoInstance = null;
  }

  hasForm() {
    return this.view.hasForm();
  }

  async initMosparo() {
    try {
      this.mosparoInstance = await createMosparoInstance();
    } catch (error) {
      this.view.showMessage(
        'No fue posible cargar la validación de seguridad.',
        'error'
      );
    }
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

    const { submitToken, validationToken } = getMosparoTokens(this.view.dom.form);

    if (!submitToken || !validationToken) {
      this.view.showMessage(
        'Completa la validación de seguridad.',
        'error'
      );
      return;
    }

    const rawFormData = Object.fromEntries(new FormData(this.view.dom.form).entries());

    const payload = {
      formData: {
        ...rawFormData,
        privacyPolicy: formData.privacyAccepted,
        _mosparo_submitToken: submitToken,
        _mosparo_validationToken: validationToken
      }
    };

    this.view.setLoading(true);

    try {
      const result = await requestSoatQuote(payload);

      this.view.renderResult(result.data, formData.withAP);
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