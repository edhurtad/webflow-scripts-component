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

 async handleHomologationSelection(quotePublicId, vehicleTypeId, withAP) {
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
        result.message || 'No fue posible actualizar la homologación.'
      );
    }

    this.view.hideHomologationOptions();
    this.view.renderResult(result.data, withAP);
    this.view.showMessage(
      result.message || 'Cotización exitosa.',
      'success'
    );
  } catch (error) {
    this.view.hideHomologationOptions();
    this.view.showPrimaryAction();
    this.view.showResult();

    this.view.showMessage(
      error.message || 'No fue posible actualizar la homologación.',
      'error'
    );
  }
}

  async handleSubmit(event) {
    event.preventDefault();

    this.view.showMessage('');
    this.view.clearFieldErrors();
    this.view.resetResult();
    this.view.showExtraMessage('');

    const formData = this.view.getFormData();
    const validationResult = validateSoatForm(formData);

    if (!validationResult.isValid) {
      this.showValidationErrors(validationResult.errors);

      const firstErrorMessage = Object.values(validationResult.errors)[0];

      this.view.showMessage(
        firstErrorMessage || 'Por favor, completa correctamente los campos.',
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
      action: 'quote',
      formData: {
        ...rawFormData,
        withAP: formData.withAP,
        privacyPolicy: formData.privacyAccepted,
        _mosparo_submitToken: submitToken,
        _mosparo_validationToken: validationToken
      }
    };

    this.view.setLoading(true);

    try {
      const result = await requestSoatQuote(payload);

     if (result.requiresHomologationSelection) {
  this.view.showMessage('');

  this.view.renderHomologationOptions(
    result.data?.homologateOptions || [],
    (selectedOption) => {
      this.handleHomologationSelection(
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
        result.message || 'Cotización exitosa.',
        'success'
      );
    } catch (error) {
      this.view.showMessage(
  error.message || 'No fue posible realizar la cotización.',
  'error'
);

if (error.data?.endDate) {
  this.view.showExtraMessage(
    `Tu fecha de vencimiento es ${this.view.formatLongDate(error.data.endDate)}.`
  );
}

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