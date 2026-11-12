import {
  COMPARISON_WITH_TAXES,
  FEE_SCENARIOS,
  TAX_RATES
} from '../constants/business-fee-calculator.rates.js';

export const calculateFees = (
  amount,
  scenarioKey
) => {
  const scenario =
    FEE_SCENARIOS[scenarioKey];

  const fee = Math.round(
    amount * scenario.nequiRate
  );

  const tax = Math.round(
    fee * TAX_RATES.vat
  );

  const withholding =
    scenario.appliesWithholding
      ? Math.round(
          amount *
          TAX_RATES.withholding
        )
      : 0;

  const discounts =
    fee +
    tax +
    withholding;

  const comparisonFee =
    Math.round(
      amount *
      scenario.comparisonRate
    ) +
    scenario.comparisonFixedAmount;

  const comparisonTax =
    COMPARISON_WITH_TAXES
      ? Math.round(
          comparisonFee *
          TAX_RATES.vat
        )
      : 0;

  const comparisonWithholding =
    COMPARISON_WITH_TAXES
      ? withholding
      : 0;

  return {
    fee,
    tax,
    withholding,
    discounts,
    net: amount - discounts,
    comparisonFee,
    comparisonTax,
    comparisonWithholding,
    comparisonNet:
      amount -
      comparisonFee -
      comparisonTax -
      comparisonWithholding
  };
};