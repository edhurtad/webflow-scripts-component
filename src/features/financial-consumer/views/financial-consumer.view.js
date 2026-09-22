import {
  FINANCIAL_CONSUMER_IDS,
  FINANCIAL_CONSUMER_NAMES,
  FINANCIAL_CONSUMER_PLACEHOLDERS,
} from "../constants/financial-consumer.constants.js";

const getElementById = (id) => {
  return document.getElementById(id);
};

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
    this.documentNumberInput = getElementById(
      FINANCIAL_CONSUMER_IDS.documentNumber
    );

    this.emailInput = getElementById(
      FINANCIAL_CONSUMER_IDS.email
    );

    this.phoneNumberInput = getElementById(
      FINANCIAL_CONSUMER_IDS.phoneNumber
    );

    this.departmentSelect = getElementById(
      FINANCIAL_CONSUMER_IDS.department
    );

    this.citySelect = getElementById(
      FINANCIAL_CONSUMER_IDS.city
    );

    this.submissionDateInput = getElementById(
      FINANCIAL_CONSUMER_IDS.submissionDate
    );

    this.otherProductInput = getElementById(
      FINANCIAL_CONSUMER_IDS.otherProduct
    );

    this.otherProductField = getElementById(
      FINANCIAL_CONSUMER_IDS.otherProductField
    );

    this.otherServiceInput = getElementById(
      FINANCIAL_CONSUMER_IDS.otherService
    );

    this.otherServiceField = getElementById(
      FINANCIAL_CONSUMER_IDS.otherServiceField
    );

    this.caseDescriptionInput = getElementById(
      FINANCIAL_CONSUMER_IDS.caseDescription
    );

    this.specificRequestInput = getElementById(
      FINANCIAL_CONSUMER_IDS.specificRequest
    );

    this.amountInput = getElementById(
      FINANCIAL_CONSUMER_IDS.amount
    );

    this.productRadios = Array.from(
      document.querySelectorAll(
        `input[name="${FINANCIAL_CONSUMER_NAMES.claimedProduct}"]`
      )
    );

    this.serviceRadios = Array.from(
      document.querySelectorAll(
        `input[name="${FINANCIAL_CONSUMER_NAMES.claimedService}"]`
      )
    );

    this.fileInputs = Array.from(
      document.querySelectorAll('input[type="file"]')
    );

    this.form =
      this.submissionDateInput?.closest("form") ??
      this.documentNumberInput?.closest("form") ??
      null;
  }

  setSubmissionDate(value) {
    if (!this.submissionDateInput) return;

    this.submissionDateInput.value = value;
    this.submissionDateInput.readOnly = true;
  }

  createHiddenField({
    sourceInput,
    name,
  }) {
    if (!sourceInput || !this.form) {
      return null;
    }

    const hiddenInput = document.createElement("input");

    hiddenInput.type = "hidden";
    hiddenInput.name = name;
    hiddenInput.dataset.source = sourceInput.id;

    sourceInput.removeAttribute("name");

    this.form.appendChild(hiddenInput);

    return hiddenInput;
  }

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
          departmentKey: department.key,
        })
      );
    });
  }

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
    const selectedOption =
      this.departmentSelect?.selectedOptions?.[0];

    return selectedOption?.dataset?.key ?? "";
  }

  getSelectedProduct() {
    return (
      this.productRadios.find(
        (radio) => radio.checked
      )?.value ?? ""
    );
  }

  getSelectedService() {
    return (
      this.serviceRadios.find(
        (radio) => radio.checked
      )?.value ?? ""
    );
  }

  toggleOtherProduct(show) {
    if (!this.otherProductField) return;

    this.otherProductField.hidden = !show;

    if (!this.otherProductInput) return;

    this.otherProductInput.disabled = !show;
    this.otherProductInput.required = show;

    if (!show) {
      this.otherProductInput.value = "";
    }
  }

  toggleOtherService(show) {
    if (!this.otherServiceField) return;

    this.otherServiceField.hidden = !show;

    if (!this.otherServiceInput) return;

    this.otherServiceInput.disabled = !show;
    this.otherServiceInput.required = show;

    if (!show) {
      this.otherServiceInput.value = "";
    }
  }

  setupCounter({
    textarea,
    counterId,
    maxCharacters,
  }) {
    if (!textarea) return;

    textarea.maxLength = maxCharacters;

    let counter = getElementById(counterId);

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

  setValidity(input, message = "") {
    if (!input) return;

    input.setCustomValidity(message);
  }

  showValidity(input) {
    input?.reportValidity();
  }
}