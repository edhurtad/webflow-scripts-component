import {
  FINANCIAL_CONSUMER_IDS,
  FINANCIAL_CONSUMER_NAMES,
  FINANCIAL_CONSUMER_PLACEHOLDERS,
} from "../constants/financial-consumer.constants.js";

/**
 * @typedef {Object} Department
 * @property {string} id
 * @property {string} key
 * @property {string} label
 */

/**
 * @typedef {Object} City
 * @property {string} id
 * @property {string} label
 */

/**
 * @typedef {Object} SelectOptionConfig
 * @property {string} [value]
 * @property {string} label
 * @property {boolean} [disabled]
 * @property {boolean} [selected]
 * @property {string|null} [departmentKey]
 */

/**
 * @typedef {Object} HiddenFieldConfig
 * @property {HTMLInputElement} sourceInput
 * @property {string} name
 */

/**
 * @typedef {Object} CounterConfig
 * @property {HTMLTextAreaElement|null} textarea
 * @property {string} counterId
 * @property {number} maxCharacters
 */

/**
 * Obtiene un elemento del DOM por ID.
 *
 * @param {string} id
 * @returns {HTMLElement|null}
 */
const getElementById = (id) => {
  return document.getElementById(id);
};

/**
 * Crea una opción para un select.
 *
 * @param {SelectOptionConfig} config
 * @returns {HTMLOptionElement}
 */
const createOption = ({
  value = "",
  label,
  disabled = false,
  selected = false,
  departmentKey = null,
}) => {
  const option = document.createElement("option");

  option.value = value;
  option.textContent = label;
  option.disabled = disabled;
  option.selected = selected;

  if (departmentKey) {
    option.dataset.key = departmentKey;
  }

  return option;
};

export class FinancialConsumerView {
  constructor() {
    /** @type {HTMLInputElement|null} */
    this.documentNumberInput =
      /** @type {HTMLInputElement|null} */ (
        getElementById(
          FINANCIAL_CONSUMER_IDS.documentNumber
        )
      );

    /** @type {HTMLInputElement|null} */
    this.emailInput =
      /** @type {HTMLInputElement|null} */ (
        getElementById(
          FINANCIAL_CONSUMER_IDS.email
        )
      );

    /** @type {HTMLInputElement|null} */
    this.phoneNumberInput =
      /** @type {HTMLInputElement|null} */ (
        getElementById(
          FINANCIAL_CONSUMER_IDS.phoneNumber
        )
      );

    /** @type {HTMLSelectElement|null} */
    this.departmentSelect =
      /** @type {HTMLSelectElement|null} */ (
        getElementById(
          FINANCIAL_CONSUMER_IDS.department
        )
      );

    /** @type {HTMLSelectElement|null} */
    this.citySelect =
      /** @type {HTMLSelectElement|null} */ (
        getElementById(
          FINANCIAL_CONSUMER_IDS.city
        )
      );

    /** @type {HTMLInputElement|null} */
    this.submissionDateInput =
      /** @type {HTMLInputElement|null} */ (
        getElementById(
          FINANCIAL_CONSUMER_IDS.submissionDate
        )
      );

    /** @type {HTMLTextAreaElement|null} */
    this.otherProductInput =
      /** @type {HTMLTextAreaElement|null} */ (
        getElementById(
          FINANCIAL_CONSUMER_IDS.otherProduct
        )
      );

    /** @type {HTMLElement|null} */
    this.otherProductField =
      getElementById(
        FINANCIAL_CONSUMER_IDS.otherProductField
      );

    /** @type {HTMLTextAreaElement|null} */
    this.otherServiceInput =
      /** @type {HTMLTextAreaElement|null} */ (
        getElementById(
          FINANCIAL_CONSUMER_IDS.otherService
        )
      );

    /** @type {HTMLElement|null} */
    this.otherServiceField =
      getElementById(
        FINANCIAL_CONSUMER_IDS.otherServiceField
      );

    /** @type {HTMLTextAreaElement|null} */
    this.caseDescriptionInput =
      /** @type {HTMLTextAreaElement|null} */ (
        getElementById(
          FINANCIAL_CONSUMER_IDS.caseDescription
        )
      );

    /** @type {HTMLTextAreaElement|null} */
    this.specificRequestInput =
      /** @type {HTMLTextAreaElement|null} */ (
        getElementById(
          FINANCIAL_CONSUMER_IDS.specificRequest
        )
      );

    /** @type {HTMLInputElement|null} */
    this.amountInput =
      /** @type {HTMLInputElement|null} */ (
        getElementById(
          FINANCIAL_CONSUMER_IDS.amount
        )
      );

    /** @type {HTMLInputElement[]} */
    this.productRadios = Array.from(
      document.querySelectorAll(
        `input[name="${FINANCIAL_CONSUMER_NAMES.claimedProduct}"]`
      )
    );

    /** @type {HTMLInputElement[]} */
    this.serviceRadios = Array.from(
      document.querySelectorAll(
        `input[name="${FINANCIAL_CONSUMER_NAMES.claimedService}"]`
      )
    );

    /** @type {HTMLInputElement[]} */
    this.fileInputs = Array.from(
      document.querySelectorAll(
        'input[type="file"]'
      )
    );

    /** @type {HTMLFormElement|null} */
    this.form =
      this.submissionDateInput?.closest("form") ??
      this.documentNumberInput?.closest("form") ??
      null;
  }

  /**
   * Asigna la fecha visible del formulario.
   *
   * @param {string} value
   * @returns {void}
   */
  setSubmissionDate(value) {
    if (!this.submissionDateInput) return;

    this.submissionDateInput.value = value;
    this.submissionDateInput.readOnly = true;
  }

  /**
   * Crea un input hidden asociado a un campo visible.
   *
   * @param {HiddenFieldConfig} config
   * @returns {HTMLInputElement|null}
   */
  createHiddenField({
    sourceInput,
    name,
  }) {
    if (!sourceInput || !this.form) {
      return null;
    }

    const hiddenInput =
      document.createElement("input");

    hiddenInput.type = "hidden";
    hiddenInput.name = name;
    hiddenInput.dataset.source =
      sourceInput.id;

    sourceInput.removeAttribute("name");

    this.form.appendChild(
      hiddenInput
    );

    return hiddenInput;
  }

  /**
   * Renderiza las opciones de departamentos.
   *
   * @param {Department[]} departments
   * @returns {void}
   */
  renderDepartments(departments) {
    if (!this.departmentSelect) return;

    this.departmentSelect.innerHTML = "";

    this.departmentSelect.appendChild(
      createOption({
        label:
          FINANCIAL_CONSUMER_PLACEHOLDERS.department,
        disabled: true,
        selected: true,
      })
    );

    departments.forEach((department) => {
      this.departmentSelect.appendChild(
        createOption({
          value: department.id,
          label: department.label,
          departmentKey:
            department.key,
        })
      );
    });
  }

  /**
   * Renderiza las ciudades disponibles.
   *
   * @param {City[]} [cities=[]]
   * @returns {void}
   */
  renderCities(cities = []) {
    if (!this.citySelect) return;

    this.citySelect.innerHTML = "";

    this.citySelect.appendChild(
      createOption({
        label:
          FINANCIAL_CONSUMER_PLACEHOLDERS.city,
        disabled: true,
        selected: true,
      })
    );

    cities.forEach((city) => {
      this.citySelect.appendChild(
        createOption({
          value: city.id,
          label: city.label,
        })
      );
    });
  }

  /**
   * Obtiene la key del departamento seleccionado.
   *
   * @returns {string}
   */
  getSelectedDepartmentKey() {
    const selectedOption =
      this.departmentSelect
        ?.selectedOptions?.[0];

    return (
      selectedOption?.dataset?.key ??
      ""
    );
  }

  /**
   * Obtiene el producto seleccionado.
   *
   * @returns {string}
   */
  getSelectedProduct() {
    return (
      this.productRadios.find(
        (radio) => radio.checked
      )?.value ?? ""
    );
  }

  /**
   * Obtiene el servicio seleccionado.
   *
   * @returns {string}
   */
  getSelectedService() {
    return (
      this.serviceRadios.find(
        (radio) => radio.checked
      )?.value ?? ""
    );
  }

  /**
   * Muestra u oculta el campo de otro producto.
   *
   * @param {boolean} show
   * @returns {void}
   */
  toggleOtherProduct(show) {
    if (
      !this.otherProductField ||
      !this.otherProductInput
    ) {
      return;
    }

    this.otherProductField.hidden =
      !show;

    this.otherProductField.style.display =
      show ? "" : "none";

    this.otherProductInput.disabled =
      !show;

    this.otherProductInput.required =
      show;

    if (!show) {
      this.otherProductInput.value =
        "";
    }
  }

  /**
   * Muestra u oculta el campo de otro servicio.
   *
   * @param {boolean} show
   * @returns {void}
   */
  toggleOtherService(show) {
    if (
      !this.otherServiceField ||
      !this.otherServiceInput
    ) {
      return;
    }

    this.otherServiceField.hidden =
      !show;

    this.otherServiceField.style.display =
      show ? "" : "none";

    this.otherServiceInput.disabled =
      !show;

    this.otherServiceInput.required =
      show;

    if (!show) {
      this.otherServiceInput.value =
        "";
    }
  }

  /**
   * Configura un contador de caracteres.
   *
   * @param {CounterConfig} config
   * @returns {void}
   */
  setupCounter({
    textarea,
    counterId,
    maxCharacters,
  }) {
    if (!textarea) return;

    textarea.maxLength =
      maxCharacters;

    /** @type {HTMLElement|null} */
    let counter =
      getElementById(counterId);

    if (!counter) {
      counter =
        document.createElement("div");

      counter.id = counterId;

      textarea.insertAdjacentElement(
        "afterend",
        counter
      );
    }

    const updateCounter = () => {
      counter.textContent =
        `${textarea.value.length}/${maxCharacters}`;
    };

    textarea.addEventListener(
      "input",
      updateCounter
    );

    updateCounter();
  }

  /**
   * Define un mensaje de validación nativo.
   *
   * @param {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement|null} input
   * @param {string} [message=""]
   * @returns {void}
   */
  setValidity(
    input,
    message = ""
  ) {
    if (!input) return;

    input.setCustomValidity(message);
  }

  /**
   * Muestra el mensaje de validación nativo.
   *
   * @param {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement|null} input
   * @returns {void}
   */
  showValidity(input) {
    input?.reportValidity();
  }
}