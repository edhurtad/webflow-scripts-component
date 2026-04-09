import { formatCurrency } from '../../shared/utils/formatters/currency.formatter.js';

const getDOMElements = () => {
  return {
    form: document.querySelector('#soat-form'),
    button: document.querySelector('#quote-btn'),
    message: document.querySelector('#sim-message'),
    fields: [...document.querySelectorAll('.soat-box-field')],
    privacy: document.querySelector('.soat-privacy'),
    inputs: {
      phone: document.querySelector('#phone'),
      plate: document.querySelector('#plate'),
      identification: document.querySelector('#identification'),
      withAP: document.querySelector('#with-ap'),
      privacyPolicy: document.querySelector('#privacy-policy')
    },
    result: {
      container: document.querySelector('#soat-result'),
      vehicleType: document.querySelector('#vehicle-type'),
      soatTotal: document.querySelector('#soat-total'),
      apValue: document.querySelector('#ap-value'),
      finalTotal: document.querySelector('#final-total')
    }
  };
};

export class SoatView {
  constructor() {
    this.dom = getDOMElements();
  }

  hasForm() {
    return Boolean(this.dom.form);
  }

  showMessage(text = '', type = 'success') {
    const { message } = this.dom;

    if (!message) return;

    message.textContent = text;

    message.classList.remove(
      'soat-alert--hidden',
      'soat-alert--success',
      'soat-alert--error'
    );

    if (!text) {
      message.classList.add('soat-alert--hidden');
      return;
    }

    message.classList.add(
      type === 'error'
        ? 'soat-alert--error'
        : 'soat-alert--success'
    );
  }

  setLoading(isLoading) {
    const { button } = this.dom;

    if (!button) return;

    button.disabled = isLoading;
    button.textContent = isLoading
      ? 'Cotizando...'
      : 'Calcular mi SOAT';
  }

  markFieldError(fieldName) {
    // 👇 manejo especial para privacidad
    if (fieldName === 'privacyAccepted') {
      this.dom.privacy?.classList.add('is-error');
      return;
    }

    const input = this.dom.inputs[fieldName];
    const wrapper = input?.closest('.soat-box-field');

    if (wrapper) {
      wrapper.classList.add('is-error');
    }
  }

  clearFieldErrors() {
    this.dom.fields.forEach((field) => {
      field.classList.remove('is-error');
    });

    this.dom.privacy?.classList.remove('is-error');
  }

  // ✅ ÚNICO getFormData (corregido)
  getFormData() {
    return {
      phone: this.dom.inputs.phone?.value?.trim() || '',
      plate: this.dom.inputs.plate?.value?.trim() || '',
      identification: this.dom.inputs.identification?.value?.trim() || '',
      withAP: this.dom.inputs.withAP?.checked || false,
      privacyAccepted: this.dom.inputs.privacyPolicy?.checked || false
    };
  }

  renderResult(data) {
    if (!data) return;

    const apAvailable = Boolean(data.ApAvailable);
    const apText = apAvailable
      ? formatCurrency(data.Value_AP)
      : 'No disponible';

    this.dom.result.vehicleType.textContent = data.VehicleTypeName || '-';
    this.dom.result.soatTotal.textContent = formatCurrency(data.TotalValue);
    this.dom.result.apValue.textContent = apText;
    this.dom.result.finalTotal.textContent = formatCurrency(
      data.TotalSummedValue || data.TotalValue
    );

    this.dom.result.container.style.display = 'block';
  }

  resetResult() {
    this.dom.result.vehicleType.textContent = '-';
    this.dom.result.soatTotal.textContent = '$ 0';
    this.dom.result.apValue.textContent = '-';
    this.dom.result.finalTotal.textContent = '$ 0';
  }

  initFloatingLabels() {
    this.dom.fields.forEach((field) => {
      const input = field.querySelector('input');
      if (!input) return;

      const toggleFilledState = () => {
        field.classList.toggle('is-filled', input.value.trim() !== '');
      };

      input.addEventListener('input', toggleFilledState);
      input.addEventListener('blur', toggleFilledState);

      field.addEventListener('click', () => input.focus());

      toggleFilledState();
    });
  }

  initInputFormatting() {
    const { phone, plate, identification } = this.dom.inputs;

    phone?.addEventListener('input', (event) => {
      event.target.value = event.target.value.replace(/\D/g, '').slice(0, 10);
    });

    plate?.addEventListener('input', (event) => {
      event.target.value = event.target.value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 6);
    });

    identification?.addEventListener('input', (event) => {
      event.target.value = event.target.value.replace(/\D/g, '');
    });
  }

  onSubmit(callback) {
    this.dom.form?.addEventListener('submit', callback);
  }
}