export const TAX_RATES =
  Object.freeze({
    vat: 0.19, // IVA: 19 %
    withholding: 0.015 // Retención: 1,5 %
  });

// Aplica IVA a las tarifas de la plataforma comparada.
export const COMPARISON_WITH_TAXES =
  true;

export const FEE_SCENARIOS =
  Object.freeze({
    card: {
      nequiRate: 0.0199, // Nequi: 1,99 %
      appliesWithholding: true,
      comparisonRate: 0.0269, // Bold: 2,69 %
      comparisonFixedAmount: 300
    },

    nequi: {
      nequiRate: 0.015, // Nequi/Bancolombia: 1,5 %
      appliesWithholding: false,
      comparisonRate: 0.0249, // Bold PSE: 2,49 %
      comparisonFixedAmount: 300
    },

    other: {
      nequiRate: 0.0269, // Nequi PSE: 2,69 %
      appliesWithholding: false,
      comparisonRate: 0.0249, // Bold PSE: 2,49 %
      comparisonFixedAmount: 300
    }
  });