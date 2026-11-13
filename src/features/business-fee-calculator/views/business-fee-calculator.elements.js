const getRequiredElement = (
  root,
  id
) => {
  const selector =
    `#fee-calc-${id}`;

  const element =
    root.querySelector(selector);

  if (!element) {
    throw new Error(
      `Business Fee Calculator: falta el elemento ${selector}`
    );
  }

  return element;
};

export const getCalculatorElements = (
  root
) => {
  const byId = (id) =>
    getRequiredElement(root, id);

  return {
    root,

    formView: byId('form-view'),
    resultView: byId('result-view'),

    methods: [
      byId('method-card'),
      byId('method-link')
    ],
    methodError: byId('method-error'),

    amountInput: byId('amount'),
    amountError: byId('amount-error'),

    leadBox: byId('lead'),
    phoneInput: byId('phone'),
    phoneHelp: byId('phone-help'),
    consentInput: byId('consent'),
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

    linkDetail: byId('link-detail'),
    linkHeading: byId('link-heading'),
    linkSale: byId('link-sale'),
    linkFeeLabel: byId('link-fee-label'),
    linkFee: byId('link-fee'),
    linkTax: byId('link-tax'),
    linkTotal: byId('link-total'),

    cardDetail: byId('card-detail'),
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