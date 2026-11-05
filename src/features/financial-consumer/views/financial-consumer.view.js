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

/**
 * @param {HTMLElement|null} field
 * @param {HTMLTextAreaElement|null} input
 * @param {boolean} show
 */
const toggleConditionalField = (field, input, show) => {
  if (!field || !input) return;

  field.hidden = !show;
  field.style.display = show ? "" : "none";

  input.disabled = !show;
  input.required = show;

  if (!show) {
    input.value = "";
  }
};

export class FinancialConsumerView {
  constructor() {
    this.documentNumberInput =
      /** @type {HTMLInputElement|null} */ (
        document.getElementById(FINANCIAL_CONSUMER_IDS.documentNumber)
      );

    this.emailInput =
      /** @type {HTMLInputElement|null} */ (
        document.getElementById(FINANCIAL_CONSUMER_IDS.email)
      );

    this.phoneNumberInput =
      /** @type {HTMLInputElement|null} */ (
        document.getElementById(FINANCIAL_CONSUMER_IDS.phoneNumber)
      );

    this.departmentSelect =
      /** @type {HTMLSelectElement|null} */ (
        document.getElementById(FINANCIAL_CONSUMER_IDS.department)
      );

    this.citySelect =
      /** @type {HTMLSelectElement|null} */ (
        document.getElementById(FINANCIAL_CONSUMER_IDS.city)
      );

    this.submissionDateInput =
      /** @type {HTMLInputElement|null} */ (
        document.getElementById(FINANCIAL_CONSUMER_IDS.submissionDate)
      );

    this.otherProductInput =
      /** @type {HTMLTextAreaElement|null} */ (
        document.getElementById(FINANCIAL_CONSUMER_IDS.otherProduct)
      );

    this.otherProductField =
      document.getElementById(FINANCIAL_CONSUMER_IDS.otherProductField);

    this.otherServiceInput =
      /** @type {HTMLTextAreaElement|null} */ (
        document.getElementById(FINANCIAL_CONSUMER_IDS.otherService)
      );

    this.otherServiceField =
      document.getElementById(FINANCIAL_CONSUMER_IDS.otherServiceField);

    this.caseDescriptionInput =
      /** @type {HTMLTextAreaElement|null} */ (
        document.getElementById(FINANCIAL_CONSUMER_IDS.caseDescription)
      );

    this.specificRequestInput =
      /** @type {HTMLTextAreaElement|null} */ (
        document.getElementById(FINANCIAL_CONSUMER_IDS.specificRequest)
      );

    this.amountInput =
      /** @type {HTMLInputElement|null} */ (
        document.getElementById(FINANCIAL_CONSUMER_IDS.amount)
      );

    this.form =
      this.submissionDateInput?.form ??
      this.documentNumberInput?.form ??
      null;

    this.productRadios =
      /** @type {HTMLInputElement[]} */ (
        Array.from(
          this.form?.querySelectorAll(
            `input[name="${FINANCIAL_CONSUMER_NAMES.claimedProduct}"]`
          ) ?? []
        )
      );

    this.serviceRadios =
      /** @type {HTMLInputElement[]} */ (
        Array.from(
          this.form?.querySelectorAll(
            `input[name="${FINANCIAL_CONSUMER_NAMES.claimedService}"]`
          ) ?? []
        )
      );

    this.fileInputs =
      /** @type {HTMLInputElement[]} */ (
        Array.from(
          this.form?.querySelectorAll('input[type="file"]') ?? []
        )
      );
  }

  setSubmissionDate(value) {
    if (!this.submissionDateInput) return;

    this.submissionDateInput.value = value;
    this.submissionDateInput.readOnly = true;
  }

  /**
   * @param {HiddenFieldConfig} config
   * @returns {HTMLInputElement|null}
   */
  createHiddenField({ sourceInput, name }) {
    if (!sourceInput || !this.form) return null;

    const hiddenInput = document.createElement("input");

    hiddenInput.type = "hidden";
    hiddenInput.name = name;
    hiddenInput.dataset.source = sourceInput.id;

    sourceInput.removeAttribute("name");
    this.form.appendChild(hiddenInput);

    return hiddenInput;
  }

  /**
   * @param {Department[]} departments
   */
  renderDepartments(departments) {
    if (!this.departmentSelect) return;

    this.departmentSelect.innerHTML = "";

    this.departmentSelect.appendChild(
      createOption({
        label: FINANCIAL_CONSUMER_PLACEHOLDERS.department,
        disabled: true,
        selected: true,
      })
    );

    departments.forEach((department) => {
      this.departmentSelect.appendChild(
        createOption({
          value: department.id,
          label: department.label,
          departmentKey: department.key,
        })
      );
    });
  }

  /**
   * @param {City[]} [cities=[]]
   */
  renderCities(cities = []) {
    if (!this.citySelect) return;

    this.citySelect.innerHTML = "";

    this.citySelect.appendChild(
      createOption({
        label: FINANCIAL_CONSUMER_PLACEHOLDERS.city,
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

  getSelectedDepartmentKey() {
    return (
      this.departmentSelect?.selectedOptions?.[0]?.dataset?.key ??
      ""
    );
  }

  getSelectedProduct() {
    return (
      this.productRadios.find((radio) => radio.checked)?.value ??
      ""
    );
  }

  getSelectedService() {
    return (
      this.serviceRadios.find((radio) => radio.checked)?.value ??
      ""
    );
  }

  toggleOtherProduct(show) {
    toggleConditionalField(
      this.otherProductField,
      this.otherProductInput,
      show
    );
  }

  toggleOtherService(show) {
    toggleConditionalField(
      this.otherServiceField,
      this.otherServiceInput,
      show
    );
  }

  /**
   * @param {CounterConfig} config
   */
  setupCounter({
    textarea,
    counterId,
    maxCharacters,
  }) {
    if (!textarea) return;

    textarea.maxLength = maxCharacters;

    let counter = document.getElementById(counterId);

    if (!counter) {
      counter = document.createElement("div");
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
   * @param {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement|null} input
   * @param {string} [message=""]
   */
  setValidity(input, message = "") {
    if (!input) return;

    input.setCustomValidity(message);
  }

  /**
   * @param {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement|null} input
   */
  showValidity(input) {
    input?.reportValidity();
  }
}