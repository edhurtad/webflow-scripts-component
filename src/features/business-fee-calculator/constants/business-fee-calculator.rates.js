export const TAX_RATES = Object.freeze({
  vat: 0.19, // IVA: 19 %
  withholding: 0.015 // Retención: 1,5 %
});

// Incluye impuestos en la comparación con otras plataformas.
export const COMPARISON_WITH_TAXES = true;

export const FEE_SCENARIOS = Object.freeze({
  card: {
    nequiRate: 0.0199, // Tarifa Nequi: 1,99 %
    appliesWithholding: true,
    comparisonRate: 0.0269, // Otra plataforma: 2,69 %
    comparisonFixedAmount: 300 // Cobro fijo: $300
  },

  nequi: {
    nequiRate: 0.015, // Tarifa Nequi: 1,5 %
    appliesWithholding: false,
    comparisonRate: 0.015, // Otra plataforma: 1,5 %
    comparisonFixedAmount: 0
  },

  other: {
    nequiRate: 0.0269, // Tarifa Nequi: 2,69 %
    appliesWithholding: false,
    comparisonRate: 0.0249, // Otra plataforma: 2,49 %
    comparisonFixedAmount: 300 // Cobro fijo: $300
  }
});