/**
 * Busca un elemento obligatorio y comprueba su tipo.
 *
 * @template {HTMLElement} T
 * @param {HTMLElement} root
 * @param {string} id
 * @param {new (...args: any[]) => T} ElementClass
 * @returns {T}
 */
const getRequiredElement = (
  root,
  id,
  ElementClass
) => {
  const selector =
    `#fee-calc-${id}`;

  const element =
    root.querySelector(selector);

  if (!(element instanceof ElementClass)) {
    throw new Error(
      `Business Fee Calculator: falta el elemento ${selector} o tiene un tipo incorrecto`
    );
  }

  return element;
};

/**
 * Obtiene los elementos requeridos por la calculadora.
 *
 * @param {HTMLElement} root
 */
export const getCalculatorElements = (
  root
) => {
  /** @type {(id: string) => HTMLElement} */
  const byId = (id) =>
    getRequiredElement(
      root,
      id,
      HTMLElement
    );

  /** @type {(id: string) => HTMLInputElement} */
  const inputById = (id) =>
    getRequiredElement(
      root,
      id,
      HTMLInputElement
    );

  /** @type {(id: string) => HTMLDetailsElement} */
  const detailsById = (id) =>
    getRequiredElement(
      root,
      id,
      HTMLDetailsElement
    );

  return {
    root,

    formView: byId('form-view'),
    resultView: byId('result-view'),

    methods: [
      byId('method-card'),
      byId('method-link')
    ],
    methodError: byId('method-error'),

    amountInput: inputById('amount'),
    amountError: byId('amount-error'),

    leadBox: byId('lead'),
    phoneInput: inputById('phone'),
    phoneHelp: byId('phone-help'),
    consentInput: inputById('consent'),
    consentError: byId('consent-error'),

    savedBox: byId('saved'),
    savedPhone: byId('saved-phone'),
    editButton: byId('saved-edit'),

    submitButton: byId('submit'),
    backButton: byId('back'),
    resultTitle: byId('result-title'),
    resultSubtitle: byId('result-subtitle'),

    saleBlock: byId('sale-block'),
    saleOutput: byId('sale'),

    sourcesBox: byId('sources'),
    sources: [
      byId('source-nequi'),
      byId('source-other')
    ],

    comparisonBlock:
      byId('comparison-block'),
    nequiBadge: byId('nequi-badge'),
    nequiNet: byId('nequi-net'),
    otherNet: byId('other-net'),

    linkDetail:
      detailsById('link-detail'),
    linkNote: byId('link-note'),
    linkSale: byId('link-sale'),
    linkFeeLabel: byId('link-fee-label'),
    linkFee: byId('link-fee'),
    linkTax: byId('link-tax'),
    linkTotal: byId('link-total'),

    cardDetail:
      detailsById('card-detail'),
    cardFee: byId('card-fee'),
    cardTax: byId('card-tax'),
    cardWithholding:
      byId('card-withholding'),
    cardTotal: byId('card-total'),

    mobileCtas: [
      byId('cta-get-nequi-business'),
      byId('cta-start-collecting')
    ]
  };
};