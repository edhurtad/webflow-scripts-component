import { SOAT_MESSAGES } from '../constants/soat.messages.js';
import { formatCurrency } from '../../../shared/utils/formatters/currency.formatter.js';

const getDOMElements = () => {
  return {
    form: document.querySelector('#soat-form'),
    button: document.querySelector('#quote-btn'),
    message: document.querySelector('#sim-message'),
    extraMessage: document.querySelector('#sim-extra-message'),
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
    },
    homologation: {
      container: document.querySelector('#soat-homologation'),
      options: document.querySelector('#soat-homologation-options')
    }
  };
};

export class SoatView {
  constructor() {
    this.dom = getDOMElements();
  }

  /**
   * Valida si existe el formulario SOAT en la página.
   *
   * @returns {boolean}
   */
  hasForm() {
    return Boolean(this.dom.form);
  }

  /**
   * Muestra un mensaje de estado al usuario.
   *
   * @param {string} text
   * @param {'success'|'error'} type
   * @returns {void}
   */
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
      type === 'error' ? 'soat-alert--error' : 'soat-alert--success'
    );
  }

  /**
   * Cambia el estado visual del botón principal.
   *
   * @param {boolean} isLoading
   * @returns {void}
   */
  setLoading(isLoading) {
    const { button } = this.dom;

    if (!button) return;

    button.disabled = isLoading;
    button.textContent = isLoading
      ? SOAT_MESSAGES.QUOTE_LOADING
      : SOAT_MESSAGES.QUOTE_BUTTON;
  }

  /**
   * Marca visualmente un campo con error.
   *
   * @param {string} fieldName
   * @returns {void}
   */
  markFieldError(fieldName) {
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

  /**
   * Limpia errores visuales del formulario.
   *
   * @returns {void}
   */
  clearFieldErrors() {
    this.dom.fields.forEach((field) => {
      field.classList.remove('is-error');
    });

    this.dom.privacy?.classList.remove('is-error');
  }

  /**
   * Obtiene los datos actuales del formulario.
   *
   * @returns {{ phone: string, plate: string, identification: string, withAP: boolean, privacyAccepted: boolean }}
   */
  getFormData() {
    return {
      phone: this.dom.inputs.phone?.value?.trim() || '',
      plate: this.dom.inputs.plate?.value?.trim() || '',
      identification: this.dom.inputs.identification?.value?.trim() || '',
      withAP: this.dom.inputs.withAP?.checked || false,
      privacyAccepted: this.dom.inputs.privacyPolicy?.checked || false
    };
  }

  /**
   * Renderiza el resultado final de la cotización.
   *
   * @param {Record<string, any>} data
   * @param {boolean} isApSelected
   * @returns {void}
   */
  renderResult(data, isApSelected = false) {
    if (!data) return;

    const soatTotal = Number(data.TotalValue || 0);

    const apProduct = data.Subproducts?.find(
      (product) => product.Type === 'AP'
    );

    const isApAvailable = Boolean(apProduct?.Available);
    const apValue = isApAvailable
      ? Number(apProduct?.Quote?.TotalValue || 0)
      : 0;

    const shouldIncludeAp = isApAvailable && isApSelected;

    let apText = SOAT_MESSAGES.AP_NOT_APPLICABLE;

    if (isApAvailable && shouldIncludeAp) {
      apText = formatCurrency(apValue);
    }

    if (isApAvailable && !shouldIncludeAp) {
      apText = SOAT_MESSAGES.AP_NOT_INCLUDED;
    }

    const finalTotal = soatTotal + (shouldIncludeAp ? apValue : 0);

    this.hideHomologationOptions();
    this.showPrimaryAction();

    this.dom.result.vehicleType.textContent = data.VehicleTypeName || '-';
    this.dom.result.soatTotal.textContent = formatCurrency(soatTotal);
    this.dom.result.apValue.textContent = apText;
    this.dom.result.finalTotal.textContent = formatCurrency(finalTotal);
    this.showResult();
  }

  /**
   * Reinicia los valores del resultado.
   *
   * @returns {void}
   */
  resetResult() {
    this.hideHomologationOptions();
    this.showPrimaryAction();

    this.dom.result.vehicleType.textContent = '-';
    this.dom.result.soatTotal.textContent = '$ 0';
    this.dom.result.apValue.textContent = '-';
    this.dom.result.finalTotal.textContent = '$ 0';
    this.showResult();
  }

  /**
   * Inicializa los labels flotantes.
   *
   * @returns {void}
   */
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

  /**
   * Inicializa el formateo de inputs.
   *
   * @returns {void}
   */
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
  event.target.value = event.target.value.replace(/\D/g, '').slice(0, 10);
});
  }

  /**
   * Registra el evento submit del formulario.
   *
   * @param {(event: SubmitEvent) => void} callback
   * @returns {void}
   */
  onSubmit(callback) {
    this.dom.form?.addEventListener('submit', callback);
  }

  /**
   * Oculta el botón principal.
   *
   * @returns {void}
   */
  hidePrimaryAction() {
    if (this.dom.button) {
      this.dom.button.style.display = 'none';
    }
  }

  /**
   * Muestra el botón principal.
   *
   * @returns {void}
   */
  showPrimaryAction() {
    if (this.dom.button) {
      this.dom.button.style.display = 'block';
    }
  }

  /**
   * Oculta el bloque de resultado.
   *
   * @returns {void}
   */
  hideResult() {
    if (this.dom.result?.container) {
      this.dom.result.container.style.display = 'none';
    }
  }

  /**
   * Muestra el bloque de resultado.
   *
   * @returns {void}
   */
  showResult() {
    if (this.dom.result?.container) {
      this.dom.result.container.style.display = 'block';
    }
  }

  /**
   * Oculta las opciones de homologación.
   *
   * @returns {void}
   */
  hideHomologationOptions() {
    if (this.dom.homologation?.container) {
      this.dom.homologation.container.style.display = 'none';
    }

    if (this.dom.homologation?.options) {
      this.dom.homologation.options.innerHTML = '';
    }
  }

  /**
   * Muestra un mensaje complementario.
   *
   * @param {string} text
   * @returns {void}
   */
  showExtraMessage(text = '') {
    const { extraMessage } = this.dom;

    if (!extraMessage) return;

    extraMessage.textContent = text;

    if (!text) {
      extraMessage.classList.add('soat-extra-message--hidden');
      return;
    }

    extraMessage.classList.remove('soat-extra-message--hidden');
  }

  /**
   * Muestra el loading de actualización de homologación.
   *
   * @returns {void}
   */
  showHomologationLoading() {
    if (!this.dom.homologation?.container || !this.dom.homologation?.options) {
      return;
    }

    this.hidePrimaryAction();
    this.hideResult();

    this.dom.homologation.options.innerHTML = `
      <div class="soat-homologation__loading">
        <span class="soat-spinner"></span>
        <span>${SOAT_MESSAGES.UPDATING_QUOTE}</span>
      </div>
    `;

    this.dom.homologation.container.style.display = 'block';
  }

  /**
   * Renderiza las opciones de homologación.
   *
   * @param {Array<{ vehicleTypeId: string, vehicleTypeName: string, totalValue: string }>} options
   * @param {(option: { vehicleTypeId: string, vehicleTypeName: string, totalValue: string }) => void} onSelect
   * @returns {void}
   */
  renderHomologationOptions(options = [], onSelect) {
    if (!this.dom.homologation?.container || !this.dom.homologation?.options) {
      return;
    }

    this.hidePrimaryAction();
    this.hideResult();

    this.dom.homologation.options.innerHTML = '';

    options.forEach((option) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'soat-homologation__option';

      button.innerHTML = `
        <span class="soat-homologation__option-title">${option.vehicleTypeName}</span>
        <span class="soat-homologation__option-price">
          ${SOAT_MESSAGES.ESTIMATED_VALUE}: ${formatCurrency(Number(option.totalValue || 0))}
        </span>
      `;

      button.addEventListener('click', () => {
        onSelect(option);
      });

      this.dom.homologation.options.appendChild(button);
    });

    this.dom.homologation.container.style.display = 'block';
  }
}